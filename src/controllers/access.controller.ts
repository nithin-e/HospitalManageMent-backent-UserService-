import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { UserResponse } from '../entities/user_interface';
import { IAccessService } from '@/services/interfaces/IAccess.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { BlockingUser } from '@/types';

@injectable()
export class AccessController {
    constructor(
        @inject(TYPES.AccessService)
        private readonly _accessService: IAccessService
    ) {}

    async blockUser(
        call: ServerUnaryCall<BlockingUser, boolean>,
        callback: sendUnaryData<UserResponse>
    ): Promise<void> {
        try {
            const { id: userId } = call.request;

            await this._accessService.blockUser(userId);

            callback(null, {
                success: true,
                message: 'User blocked successfully',
            });
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    }

    async unblockUser(
        call: ServerUnaryCall<BlockingUser, boolean>,
        callback: sendUnaryData<UserResponse>
    ): Promise<void> {
        try {
            const { id: userId } = call.request;

            await this._accessService.unblockUser(userId);

            callback(null, {
                success: true,
                message: 'User unBlocked successfully',
            });
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    }
}
