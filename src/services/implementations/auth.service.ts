import jwt from 'jsonwebtoken';
import bcrypt from '../../utility/bcrypt';
import { userData, UserResponse } from '../../entities/user_interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import {
    DecodedToken,
    LoginResponse,
    LoginUserResponse,
    SignupResponse,
} from '@/types';
import { IAuthService } from '../interfaces/IAuthk.service';
import { IAuthRepository } from '@/repositories/interfaces/IAuth.repository';
import { LoginUserMapper } from '@/dto/loginUser.mapper';
import { SignupUserMapper } from '@/dto/SignupUserMapper';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export class AuthService implements IAuthService {
    private _JWT_REFRESH_SECRET: string;
    private JWT_ACCESS_SECRET: string;

    constructor(
        @inject(TYPES.AuthRepository)
        private _authRepository: IAuthRepository
    ) {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error(MESSAGES.ERROR.CHECK_ENV);
        }
        this._JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        this.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
    }

    userLogin = async (loginData: {
        email: string;
        password: string;
        name?: string;
        googleId: string;
    }): Promise<LoginUserResponse> => {
        try {
            const response =
                await this._authRepository.checkUserExists(loginData);

            if (!response) throw new Error(MESSAGES.USER.NOT_FOUND);

            if (response.error === MESSAGES.AUTH.INVALID_CREDENTIALS) {
                return LoginUserMapper.toErrorResponse(
                    MESSAGES.AUTH.INVALID_CREDENTIALS
                );
            }

            const accessToken = jwt.sign(
                {
                    userId: response._id,
                    email: response.email,
                    role: response.role,
                },
                this.JWT_ACCESS_SECRET,
                { expiresIn: '30m' }
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

            return LoginUserMapper.toLoginResponse(
                response,
                accessToken,
                refreshToken
            );
        } catch (error) {
            console.error(MESSAGES.ERROR.LOGIN_FAILED, error);
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
            console.error(MESSAGES.ERROR.FORGOT_PASSWORD_FAILED, error);
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
            console.error(MESSAGES.ERROR.CHANGE_PASSWORD_FAILED, error);
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

            return response;
        } catch (error) {
            console.error(MESSAGES.ERROR.UPDATE_INFO_FAILED, error);
            throw error;
        }
    };

    userRegistration = async (userData: userData): Promise<SignupResponse> => {
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

            const savedUser = await this._authRepository.saveUser(newUserData);
            return SignupUserMapper.toSignupResponse(
                savedUser,
                MESSAGES.USER.REGISTER_SUCCESS
            );
        } catch (error) {
            console.error(MESSAGES.ERROR.REGISTER_FAILED, error);
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
                success: true,
                message: MESSAGES.AUTH.TOKEN_REFRESH_SUCCESS,
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            console.error(MESSAGES.ERROR.TOKEN_REFRESH_FAILED, error);
            return { success: false, message: MESSAGES.AUTH.TOKEN_INVALID };
        }
    };
}
