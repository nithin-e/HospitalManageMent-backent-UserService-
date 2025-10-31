import { registration, UserResponse } from '../../entities/user_interface';

export interface IAuthRepository {
    checkUserExists(userData: {
        email: string;
        password?: string;
        googleId?: string;
        name?: string;
        phoneNumber?: string;
    }): Promise<UserResponse>;

    setUpForgotPassword(userData: {
        email: string;
        newPassword?: string;
    }): Promise<UserResponse>;

    changePassword(userData: {
        email: string;
        newPassword?: string;
    }): Promise<UserResponse>;

    updateUserInformation(userData: {
        email: string;
        name: string;
        newPassword?: string;
        phoneNumber: string;
    }): Promise<UserResponse>;

       saveUser(userData: registration): Promise<UserResponse>;
        checkUser(email: string, phoneNumber: string): Promise<UserResponse>;
}
