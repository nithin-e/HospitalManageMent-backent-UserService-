import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { IAccessService } from '../interfaces/IAccess.service';
import { IAccessRepository } from '@/repositories/interfaces/IAccess.repository';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export default class AccessService implements IAccessService {
    constructor(
        @inject(TYPES.AccessRepository)
        private _accessRepository: IAccessRepository
    ) {}

    blockUser = async (userId: string): Promise<boolean> => {
        try {
            const response = await this._accessRepository.blockUser(userId);

            return response;
        } catch (error) {
            console.error(MESSAGES.ERROR.BLOCK_FAILED, error);
            throw error;
        }
    };

    unblockUser = async (userId: string): Promise<boolean> => {
        try {
            const response = await this._accessRepository.unblockUser(userId);

            return response;
        } catch (error) {
            console.error(MESSAGES.ERROR.UNBLOCK_FAILED, error);
            throw error;
        }
    };
}
