import { injectable } from 'inversify';
import { IAccessRepository } from '../interfaces/IAccess.repository';
import { BaseRepository } from './base.repository';
import { User, type User as UserType } from '../../entities/user_schema';

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

            if (!user) {
                throw new Error('User not found');
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { isActive: false },
                { new: true }
            );

            return true;
        } catch (error) {
            console.error('Error blocking user in repository:', error);
            throw error;
        }
    }

    async unblockUser(userId: string): Promise<boolean> {
        try {
            const user = await this.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { isActive: true },
                { new: true }
            );

            return true;
        } catch (error) {
            console.error('Error unblocking user in repository:', error);
            throw error;
        }
    }
}
