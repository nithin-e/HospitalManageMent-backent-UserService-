import { LoginUserResponse, SignupResponse } from '@/types';
import { userData, UserResponse } from '../../entities/user_interface';

export interface IAuthService {
    userLogin(loginData: {
        email: string;
        password: string;
        google_id?: string;
        name?: string;
    }): Promise<LoginUserResponse>;
    forgotPassword(loginData: {
        email: string;
        newPassword: string;
    }): Promise<UserResponse>;
    changeUserPassword(loginData: {
        email: string;
        password: string;
    }): Promise<UserResponse>;
    updateUserInformation(loginData: {
        email: string;
        name: string;
        phoneNumber: string;
    }): Promise<UserResponse>;

    refreshTokens(refreshToken: string): Promise<
        | {
              success: true;
              message: string;
              accessToken: string;
              refreshToken: string;
          }
        | {
              success: false;
              message: string;
          }
    >;

    userRegistration(userData: userData): Promise<SignupResponse>;

    checkUser(email: string, phoneNumber?: string): Promise<UserResponse>;
}
