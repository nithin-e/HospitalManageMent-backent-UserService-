import jwt from 'jsonwebtoken';
import bcrypt from '../../utility/bcrypt';
import { userData, UserResponse } from '../../entities/user_interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { DecodedToken, LoginResponse } from '@/types';
import { IAuthService } from '../interfaces/IAuthk.service';
import { IAuthRepository } from '@/repositories/interfaces/IAuth.repository';

@injectable()
export class AuthService implements IAuthService {
    private _JWT_REFRESH_SECRET: string;

    constructor(
        @inject(TYPES.AuthRepository)
        private _authRepository: IAuthRepository
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
        googleId: string;
    }): Promise<LoginResponse> => {
        try {
            const response =
                await this._authRepository.checkUserExists(loginData);
            if (!response) {
                throw new Error('No user data returned from repository');
            }

            if (response.error === 'Invalid credentials') {
                console.log('usecase if condition', response);
                return { success: false, message: response.error };
            }

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

            const response = await this._authRepository.setUpForgotPassword({
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

            const response = await this._authRepository.changePassword({
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
            const response = await this._authRepository.updateUserInformation({
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
    }> => {
        try {
            const { name, email, password, phoneNumber, google_id } = userData;

            const hashedPassword = await bcrypt.securePassword(password);
            const newUserData = {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                google_id,
            };

            const response = await this._authRepository.saveUser(newUserData);
            return {
                user: response,
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
            const user = await this._authRepository.checkUser(
                email,
                phoneNumber
            );

            return user;
        } catch (error: unknown) {
            return { message: (error as Error).message };
        }
    };

    refreshTokens = async (
        refreshToken: string
    ): Promise<
        | {
              success: true;
              message: string;
              accessToken: string;
              refreshToken: string;
          }
        | { success: false; message: string }
    > => {
        const refreshTokenSecret =
            process.env.JWT_REFRESH_SECRET || 'refresh-secret';
        const accessTokenSecret = process.env.ACCESS_TOKEN || 'heal-nova';

        try {
            const decoded = jwt.verify(
                refreshToken,
                refreshTokenSecret
            ) as DecodedToken;

            const accessToken = jwt.sign(
                { userId: decoded.userId, role: decoded.role },
                accessTokenSecret,
                { expiresIn: '15m' }
            );

            const newRefreshToken = jwt.sign(
                { userId: decoded.userId, role: decoded.role },
                refreshTokenSecret,
                { expiresIn: '7d' }
            );

            return {
                success: true as const,
                message: 'Token refreshed successfully',
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            console.error('❌ Refresh token error:', error);
            return {
                success: false as const,
                message: 'Invalid or expired refresh token',
            };
        }
    };
}
