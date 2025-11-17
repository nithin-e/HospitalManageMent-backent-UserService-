import * as grpc from '@grpc/grpc-js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import {
    IGrpcCall,
    GrpcCallbacks,
    FormattedUsersResponse,
    HttpStatusCode,
} from '@/types';
import { IUserService } from '@/services/interfaces/IUser.service';
import { RequestHandler } from 'express';
import { MESSAGES } from '@/constants/messages.constant';

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
            res.status(HttpStatusCode.OK).json(formattedResponse);
        } catch (error) {
            console.error(MESSAGES.USER.FETCH_FAILED, error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: MESSAGES.USER.FETCH_FAILED,
            });
        }
    };

    getUserByEmail: RequestHandler = async (req, res, next) => {
        try {
            const { email } = req.body as { email: string };

            if (!email) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: MESSAGES.USER.EMAIL_REQUEIRED,
                });
                return;
            }

            const response = await this._userService.getUserByEmail(email);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.error(MESSAGES.USER.FETCH_FAILED, error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: MESSAGES.USER.NOT_FOUND,
            });
        }
    };

    searchUsers: RequestHandler = async (req, res, next) => {
        try {
            const {
                q = '',
                sortBy = 'createdAt',
                sortDirection = 'desc',
                role = '',
                page = '1',
                limit = '5',
                status = '',
            } = req.query;

            const pageNum = parseInt(page as string, 10) || 1;
            const limitNum = parseInt(limit as string, 10) || 5;

            const response = await this._userService.searchUsers(
                q as string,
                sortBy as string,
                sortDirection as 'asc' | 'desc',
                role as string,
                pageNum,
                limitNum,
                status as string
            );

            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.error(MESSAGES.USER.SEARCH_FAILED, error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: MESSAGES.USER.SEARCH_FAILED,
            });
        }
    };

    getUserDetailsViaSocket = async (
        call: IGrpcCall,
        callback: GrpcCallbacks
    ): Promise<void> => {
        try {
            const { patientId } = call.request;

            if (!patientId) {
                throw new Error(MESSAGES.USER.EMAIL_REQUEIRED);
            }

            const patientResponse =
                await this._userService.getUserDetailsViaSocket(patientId);

            callback(null, patientResponse);
        } catch (error) {
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
        }
    };
}
