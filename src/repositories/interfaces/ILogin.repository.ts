import { UserResponse } from '../../entities/user_interface';

export interface ILoginRepository {
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
}
