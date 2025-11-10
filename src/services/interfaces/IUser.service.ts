import { UserDTO } from '@/dto/user.dto';
import { SearchUserResponse } from '@/types';

export interface IUserService {
    getAllUsers(): Promise<UserDTO[]>;

    getUserByEmail(email: string): Promise<UserDTO>;

    searchUsers(
        searchQuery?: string,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        role?: string,
        page?: number,
        limit?: number,
        status?: string
    ): Promise<SearchUserResponse>;

    getUserDetailsViaSocket(patientId: string): Promise<UserDTO>;
}
