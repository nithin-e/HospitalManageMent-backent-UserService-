import { IUserBlockAndUnblockService } from '../interfaces/IBlockAndUnblockService.';

import { IUserBlockAndUnblockRepository } from '../../repositories/interfaces/IBlockAndUnblockRepository.';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';

@injectable()
export default class AccessService implements IUserBlockAndUnblockService {
    constructor(
        @inject(TYPES.UserBlockRepository)
        private _userBlockAndUnblockRepo: IUserBlockAndUnblockRepository
    ) {}

    blockUser = async (userId: string): Promise<boolean> => {
        try {
            const response =
                await this._userBlockAndUnblockRepo.blockUser(userId);

            return response;
        } catch (error) {
            console.error('Error in login use case:', error);
            throw error;
        }
    };

    unblockUser = async (userId: string): Promise<boolean> => {
        try {
            const response =
                await this._userBlockAndUnblockRepo.unblockUser(userId);

            return response;
        } catch (error) {
            console.error('Error in login use case:', error);
            throw error;
        }
    };
}
