import * as grpc from '@grpc/grpc-js';

import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { UserMapper } from '@/dto/UserMapper';
import { UserSocketMapper } from '@/dto/UserSocketMapper';
import { IGrpcCall, GrpcCallbacks, FormattedUsersResponse } from '@/types';
import { IUserService } from '@/services/interfaces/IUser.service';
import { RequestHandler } from 'express';

@injectable()
export class UserController {
    constructor(
        @inject(TYPES.UserService) private readonly _userService: IUserService
    ) {}

    getAllUsers: RequestHandler = async (req, res, next) => {
        try {
            const response = await this._userService.getAllUsers();
            const formattedResponse: FormattedUsersResponse = {
                users: response,
            };
            res.json(formattedResponse);
        } catch (error) {
            console.error('Error fetching user data (REST):', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    getUserByEmail: RequestHandler = async (req, res, next) => {
        try {
            const { email } = req.body as { email: string };

            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }

            const response = await this._userService.getUserByEmail(email);
            const mappedResponse = new UserMapper(response).toGrpcResponse();
            res.json(mappedResponse);
        } catch (error) {
            console.error('REST getUserByEmail error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    searchUsers: RequestHandler = async (req, res, next) => {
        try {
            const {
                searchQuery = '',
                sortBy = 'createdAt',
                sortDirection = 'desc',
                role = '',
                page = 1,
                limit = 50,
            } = req.body;

            const response = await this._userService.searchUsers(
                searchQuery,
                sortBy,
                sortDirection,
                role,
                page,
                limit
            );

            res.json(response);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
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
