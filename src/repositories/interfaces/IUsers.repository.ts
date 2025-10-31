import { User } from '../../entities/user_schema';
import { RepositoryUsersResponse, SearchUserResponse } from '@/types';
import {
    registration,
    SearchParams,
    UserResponse,
} from '@/entities/user_interface';

import { IAuthRepository } from './IAuth.repository';
import { IAccessRepository } from './IAccess.repository';

export interface IUserRepository  {
    
    getAllUsers(): Promise<RepositoryUsersResponse>;

    getUserByEmail(email: string): Promise<User>;

    searchUsers(params: SearchParams): Promise<SearchUserResponse>;

    getUserDetailsViaSocket(patientId: string): Promise<User>;

    // checkUserExists(userData: {
    //     email: string;
    //     password?: string;
    //     googleId?: string;
    //     name?: string;
    //     phoneNumber?: string;
    // }): Promise<UserResponse>;

    // setUpForgotPassword(userData: {
    //     email: string;
    //     newPassword?: string;
    // }): Promise<UserResponse>;

    // changePassword(userData: {
    //     email: string;
    //     newPassword?: string;
    // }): Promise<UserResponse>;

    // updateUserInformation(userData: {
    //     email: string;
    //     name: string;
    //     newPassword?: string;
    //     phoneNumber: string;
    // }): Promise<UserResponse>;

    // saveUser(userData: registration): Promise<UserResponse>;
    // checkUser(email: string, phoneNumber: string): Promise<UserResponse>;
    // blockUser(userId: string): Promise<boolean>;
    // unblockUser(userId: string): Promise<boolean>;
}

export { SearchUserResponse };
