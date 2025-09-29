import { UserDTO } from '@/dto/user.dto';
import { SearchUserResponse } from '@/types';
import { ILoginService } from './ILoginService';
import { IRegisterService } from './IRegistretionService';


export interface IAuthService extends ILoginService, IRegisterService {
    getAllUsers(): Promise<UserDTO[]>;

    getUserByEmail(email: string): Promise<UserDTO>;

    searchUsers(
        searchQuery?: string,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        role?: string,
        page?: number,
        limit?: number
    ): Promise<SearchUserResponse>;

    getUserDetailsViaSocket(patientId: string): Promise<UserDTO>;
}
