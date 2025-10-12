import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { UserResponse } from '../entities/user_interface';
import { IAccessService } from '@/services/interfaces/IAccess.service';
import { inject } from 'inversify';
import { TYPES } from '@/types/inversify';
import { BlockingUser } from '@/types';

export class AccessController {
    constructor(
        @inject(TYPES.UserBlockAndUnblockService)
        private readonly _userBlockAndUnblockService: IAccessService
    ) {}

    async blockUser(
        call: ServerUnaryCall<BlockingUser, boolean>,
        callback: sendUnaryData<UserResponse>
    ): Promise<void> {
        try {
            console.log('check this call request', call.request);

            const { id: userId } = call.request;

            const result =
                await this._userBlockAndUnblockService.blockUser(userId);
            console.log('Block result:', result);

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
            console.log('check this call request', call.request);
            const { id: userId } = call.request;

            const result =
                await this._userBlockAndUnblockService.unblockUser(userId);

            callback(null, {
                success: true,
                message: 'User unBlocked successfully',
            });
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    }
}
