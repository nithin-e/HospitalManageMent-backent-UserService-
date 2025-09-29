
import { User } from '../../entities/user_schema';
import { RepositoryUsersResponse, SearchUserResponse } from '@/types';
import { ILoginRepository } from './ILoginRepository';
import { IRegistrationRepository } from './IRegistretionRepository';
import { SearchParams } from '@/entities/user_interface';
import { IUserBlockAndUnblockRepository } from './IBlockAndUnblockRepository.';

export interface IUserRepository extends ILoginRepository, IRegistrationRepository ,IUserBlockAndUnblockRepository{
    getAllUsers(): Promise<RepositoryUsersResponse>;

    getUserByEmail(email: string): Promise<User>;

    searchUsers(params: SearchParams): Promise<SearchUserResponse>;

    getUserDetailsViaSocket(patientId: string): Promise<User>;
}

export { SearchUserResponse };

