import { injectable } from 'inversify';
import { IAccessRepository } from '../interfaces/IAccess.repository';
import { BaseRepository } from './base.repository';
import { User, type User as UserType } from '../../entities/user_schema';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export default class AccessRepository
    extends BaseRepository<UserType>
    implements IAccessRepository
{
    constructor() {
        super(User);
    }

    async blockUser(userId: string): Promise<boolean> {
        try {
            const user = await this.findById(userId);

            if (!user) throw new Error(MESSAGES.USER.NOT_FOUND);

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { isActive: false },
                { new: true }
            );

            return true;
        } catch (error) {
            console.error(MESSAGES.ERROR.BLOCK_FAILED, error);
            throw error;
        }
    }

    async unblockUser(userId: string): Promise<boolean> {
        try {
            const user = await this.findById(userId);

            if (!user) throw new Error(MESSAGES.USER.NOT_FOUND);

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { isActive: true },
                { new: true }
            );

            return true;
        } catch (error) {
            console.error(MESSAGES.ERROR.UNBLOCK_FAILED, error);
            throw error;
        }
    }
}
