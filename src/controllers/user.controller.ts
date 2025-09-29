import * as grpc from '@grpc/grpc-js';

import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { UserMapper } from '@/dto/UserMapper';
import { UserSocketMapper } from '@/dto/UserSocketMapper';
import { IGrpcCall, GrpcCallbacks, FormattedUsersResponse } from '@/types';
import { IUserService } from '@/services/interfaces/IUserService';

@injectable()
export class UserController {
    constructor(
        @inject(TYPES.UserService) private readonly _userService: IUserService
    ) {}

    getAllUsers = async (
        call: IGrpcCall,
        callback: GrpcCallbacks
    ): Promise<void> => {
        try {
            const response = await this._userService.getAllUsers();
            const formattedResponse: FormattedUsersResponse = {
                users: response,
            };
            callback(null, formattedResponse);
        } catch (error) {
            console.log('Error fetching user data in controller:', error);
        }
    };

    getUserByEmail = async (
        call: IGrpcCall,
        callback: GrpcCallbacks
    ): Promise<void> => {
        try {
            const { email } = call.request;
            if (!email) {
                throw new Error('Email is required');
            }

            const response = await this._userService.getUserByEmail(email);
            const userData = new UserMapper(response).toGrpcResponse();
            callback(null, userData);
        } catch (error) {
            console.log('Error fetching user data in controller:', error);
        }
    };

    searchUsers = async (
        call: IGrpcCall,
        callback: GrpcCallbacks
    ): Promise<void> => {
        try {
            console.log(
                'check this request while the uer serch something',
                call.request
            );

            const {
                searchQuery = '',
                sortBy = 'createdAt',
                sortDirection = 'desc',
                role = '',
                page = 1,
                limit = 50,
            } = call.request;

            const response = await this._userService.searchUsers(
                searchQuery,
                sortBy,
                sortDirection,
                role,
                page,
                limit
            );

            callback(null, response);
        } catch (error) {
            console.log('Error in debounced search:', error);
        }
    };

    getUserDetailsViaSocket = async (
        call: IGrpcCall,
        callback: GrpcCallbacks
    ): Promise<void> => {
        try {
            const { patientId } = call.request;

            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const patientResponse =
                await this._userService.getUserDetailsViaSocket(patientId);

            const userData = new UserSocketMapper(
                patientResponse
            ).toGrpcResponse();

            callback(null, userData);
        } catch (error) {
            console.log('Error fetching user data:', error);
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
            // callback(grpcError, null);
        }
    };

  
}
