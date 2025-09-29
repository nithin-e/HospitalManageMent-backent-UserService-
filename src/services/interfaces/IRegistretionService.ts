import { userData, UserResponse } from '../../entities/user_interface';

export interface IRegisterService {
    userRegistration(userData: userData): Promise<{
        user: UserResponse;
        accessToken: string;
        refreshToken: string;
    }>;

    checkUser(email: string, phoneNumber?: string): Promise<UserResponse>;
}
