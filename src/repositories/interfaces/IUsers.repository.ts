import { User } from '../../entities/user_schema';
import { RepositoryUsersResponse, SearchUserResponse } from '@/types';
import { SearchParams } from '@/entities/user_interface';

export interface IUserRepository {
    getAllUsers(): Promise<RepositoryUsersResponse>;

    getUserByEmail(email: string): Promise<User>;

    searchUsers(params: SearchParams): Promise<SearchUserResponse>;

    getUserDetailsViaSocket(patientId: string): Promise<User>;
}

export { SearchUserResponse };
