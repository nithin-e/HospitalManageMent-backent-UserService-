import jwt from 'jsonwebtoken';
import bcrypt from '../../utility/bcrypt';
import { userData, UserResponse } from '../../entities/user_interface';
import { ILoginRepository } from '../../repositories/interfaces/ILogin.repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { IRegistrationRepository } from '@/repositories/interfaces/IRegistretion.repository';
import { LoginResponse } from '@/types';
import { ILoginService } from '../interfaces/ILogin.service';

@injectable()
export  class AuthService implements ILoginService {
    private _JWT_REFRESH_SECRET: string;

    constructor(
        @inject(TYPES.UserRepository)
        private _userRepo: IRegistrationRepository & ILoginRepository,
    ) {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error(
                'JWT_REFRESH_SECRET is not defined in environment variables'
            );
        }
        this._JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    }

    userLogin = async (loginData: {
        email: string;
        password: string;
        name?: string;
        google_id: string;
    }): Promise<LoginResponse> => {
        try {
          
            console.log('iam service layer');
            

            const response = await this._userRepo.checkUserExists(loginData);
            if (!response) {
                throw new Error('No user data returned from repository');
            }

            if (response.error === 'Invalid credentials') {
                console.log('usecase if condition', response);
                return { success: false, message: response.error };
            }

            // Include role in the JWT payload
            const accessToken = jwt.sign(
                {
                    userId: response._id,
                    email: response.email,
                    role: response.role,
                },
                this._JWT_REFRESH_SECRET,
                { expiresIn: '1m' }
            );

            const refreshToken = jwt.sign(
                {
                    userId: response._id,
                    email: response.email,
                    role: response.role,
                },
                this._JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            console.log('response from use case', response);

            return { user: response, accessToken, refreshToken, success: true };
        } catch (error) {
            console.error('Error in login use case:', error);
            throw error;
        }
    };

    forgotPassword = async (loginData: {
        email: string;
        newPassword: string;
    }): Promise<UserResponse> => {
        try {
  
            const hashedPassword = await bcrypt.securePassword(
                loginData.newPassword
            );

            const response = await this._userRepo.setUpForgotPassword({
                email: loginData.email,
                newPassword: hashedPassword,
            });

            return response;
        } catch (error) {
            console.error('Error in forget password use case:', error);
            throw error;
        }
    };

    changeUserPassword = async (loginData: {
        email: string;
        password: string;
    }): Promise<UserResponse> => {
        try {
            const hashedPassword = await bcrypt.securePassword(
                loginData.password
            );
  
            const response = await this._userRepo.changePassword({
                email: loginData.email,
                newPassword: hashedPassword,
            });

            console.log('Response from repository:', response);
            return response;
        } catch (error) {
            console.error('Error in change password service:', error);
            throw error;
        }
    };

    updateUserInformation = async (loginData: {
        email: string;
        name: string;
        phoneNumber: string;
    }): Promise<UserResponse> => {
        try {
            const response = await this._userRepo.updateUserInformation({
                email: loginData.email,
                name: loginData.name,
                phoneNumber: loginData.phoneNumber,
            });

            console.log('Response from repository:', response);
            return response;
        } catch (error) {
            console.error('Error in change user information service:', error);
            throw error;
        }
    };

    userRegistration = async (
        userData: userData
    ): Promise<{
        user: UserResponse;
        accessToken: string;
        refreshToken: string;
    }> => {
        try {
            const { name, email, password, phone_number, google_id } = userData;

            const hashedPassword = await bcrypt.securePassword(password);
            const newUserData = {
                name,
                email,
                password: hashedPassword,
                phone_number,
                google_id,
            };

            const response = await this._userRepo.saveUser(newUserData);

            const accessToken = jwt.sign(
                {
                    userId: response._id,
                    email: response.email,
                    role: response.role,
                },
                this._JWT_REFRESH_SECRET,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                {
                    userId: response._id,
                    email: response.email,
                    role: response.role,
                },
                this._JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            return {
                user: response,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    checkUser = async (
        email: string,
        phoneNumber: string
    ): Promise<UserResponse> => {
        try {
            const user = await this._userRepo.checkUser(email, phoneNumber);

            return user;
        } catch (error: unknown) {
            return { message: (error as Error).message };
        }
    };
}
