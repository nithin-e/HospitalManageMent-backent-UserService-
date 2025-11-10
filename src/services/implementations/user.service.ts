import { mapUserToDTO, UserDTO } from '../../dto/user.dto';
import { IUserRepository } from '../../repositories/interfaces/IUsers.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { IUserService } from '../interfaces/IUser.service';
import { SearchParams } from '@/entities/user_interface';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export default class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly _userRepository: IUserRepository
    ) {}

    getAllUsers = async (): Promise<UserDTO[]> => {
        try {
            const response = await this._userRepository.getAllUsers();
            const userDTOs = response.data.map(mapUserToDTO);
            return userDTOs;
        } catch (error) {
      console.error(MESSAGES.USER.FETCH_FAILED, error);
      throw new Error(MESSAGES.USER.FETCH_FAILED);
        }
    };

    getUserByEmail = async (email: string): Promise<UserDTO> => {
        try {
            const response = await this._userRepository.getUserByEmail(email);
            
            const userDTO = mapUserToDTO(response);
            return userDTO;
        } catch (error) {
      console.error(MESSAGES.USER.FETCH_FAILED, error);
      throw new Error(MESSAGES.USER.NOT_FOUND);
        }
    };

    getUserDetailsViaSocket = async (patientId: string): Promise<UserDTO> => {
        try {
            const user =
                await this._userRepository.getUserDetailsViaSocket(patientId);

            if (!user) throw new Error(MESSAGES.USER.NOT_FOUND);


            return mapUserToDTO(user);
        } catch (error) {
      console.error(MESSAGES.USER.FETCH_FAILED, error);
      throw new Error(MESSAGES.USER.NOT_FOUND);
        }
    };

    searchUsers = async (
        searchQuery: string = '',
        sortBy: string = 'createdAt',
        sortDirection: 'asc' | 'desc' = 'desc',
        role: string = '',
        page: number = 1,
        limit: number = 5,
        status: string = ''
    ) => {
        try {
            const params: SearchParams = {
                searchQuery: searchQuery || '',
                sortBy: sortBy || 'createdAt',
                sortDirection: sortDirection || 'desc',
                role: role || '',
                page: page || 1,
                limit: limit || 5,
                status: status || '',
            };

            const response = await this._userRepository.searchUsers(params);
            return {
                users: response.users,
                totalCount: response.totalCount,
                activeCount: response.activeCount,
                blockedCount: response.blockedCount,
                totalPages: Math.ceil(response.totalCount / limit),
                success: true,
                message: 'Search completed',
            };
        } catch (error) {
      console.error(MESSAGES.USER.SEARCH_FAILED, error);
      throw new Error(MESSAGES.USER.SEARCH_FAILED);
        }
    };
}
