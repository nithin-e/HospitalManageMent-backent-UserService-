import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { UserResponse } from '../entities/user_interface';
import { IAccessService } from '@/services/interfaces/IAccess.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { BlockingUser } from '@/types';
import { MESSAGES } from '@/constants/messages.constant';

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
                message:MESSAGES.USER.BLOCK_SUCCESS,
            });
        } catch (error) {
            console.error(MESSAGES.ERROR.BLOCK_FAILED, error);
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
                message: MESSAGES.USER.UNBLOCK_SUCCESS,
            });
        } catch (error) {
            console.error(MESSAGES.ERROR.UNBLOCK_FAILED, error);
        }
    }
}
