import { mapUserToDTO, UserDTO } from '../../dto/user.dto';
import { IUserRepository } from '../../repositories/interfaces/IUsersRepository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { IUserService } from '../interfaces/IUserService';
import { SearchParams } from '@/entities/user_interface';

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
            console.error('Error in login use case:', error);
            throw error;
        }
    };

    getUserByEmail = async (email: string): Promise<UserDTO> => {
        try {
            const response = await this._userRepository.getUserByEmail(email);
            const userDTO = mapUserToDTO(response);
            return userDTO;
        } catch (error) {
            console.error('Error in fetching single user use case:', error);
            throw error;
        }
    };

    getUserDetailsViaSocket = async (patientId: string): Promise<UserDTO> => {
        try {
            const user =
                await this._userRepository.getUserDetailsViaSocket(patientId);

            if (!user) {
                throw new Error(`User not found with ID: ${patientId}`);
            }

            return mapUserToDTO(user);
        } catch (error) {
            console.error('Error in fetching user details service:', error);
            throw error;
        }
    };

    searchUsers = async (
        searchQuery: string = '',
        sortBy: string = 'createdAt',
        sortDirection: 'asc' | 'desc',
        role: 'user' | 'admin' | 'doctor',
        page: number = 1,
        limit: number = 50
    ) => {
        try {
            const params: SearchParams = {
                searchQuery: searchQuery || '',
                sortBy: sortBy || 'createdAt',
                sortDirection: sortDirection || 'desc',
                role: role || '',
                page: page || 1,
                limit: limit || 50,
            };

            const response = await this._userRepository.searchUsers(params);
            return {
                users: response.users,
                totalCount: response.totalCount,
                activeCount: response.activeCount,
                blockedCount: response.blockedCount,
                success: true,
                message: 'Search completed',
            };
        } catch (error) {
            console.error('Error in debounced search service:', error);
            throw error;
        }
    };

  
}
