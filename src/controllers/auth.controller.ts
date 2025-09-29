import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import {
    checkResponse,
    LoginResponse,
    LoginUserResponse,
    signupResponse,
    userData,
    UserResponse,
} from '../entities/user_interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { LoginUserMapper } from '@/dto/LoginUserMapper';
import { SignupUserMapper } from '@/dto/SignupUserMapper';
import { forgetData, LoginUserRequest } from '@/types';
import { ILoginService } from '@/services/interfaces/ILoginService';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService)
        private readonly _userService: ILoginService
    ) {}

            login = async (
                call: ServerUnaryCall<LoginUserRequest, LoginUserResponse>,
                callback: sendUnaryData<LoginUserResponse>
            ): Promise<void> => {
                try {
                    const { email, password, google_id, name } = call.request;

                    const loginData: LoginUserRequest = {
                email,
                password,
                google_id,
                name,
            };
            const response = (await this._userService.userLogin(
                loginData
            )) as LoginResponse;

            const grpcResponse = new LoginUserMapper(response).toGrpcResponse();

            callback(null, grpcResponse);
        } catch (error) {
            console.error('Controller error:', error);
            const grpcError: ServiceError = {
                code: grpc.status.INTERNAL,
                message:
                    error instanceof Error ? error.message : 'Unknown error',
                name: 'Internal Error',
                details: '',
                metadata: new grpc.Metadata(),
            };
            callback(grpcError, null);
        }
    };

    forgotPassword = async (
        call: ServerUnaryCall<forgetData, UserResponse>,
        callback: sendUnaryData<UserResponse>
    ) => {
        try {
            const { email, newPassword } = call.request;

            if (!newPassword) {
                const grpcError = {
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'New password is required',
                };
                callback(grpcError, null);
                return;
            }

            const loginData = { email, newPassword };
            const response = await this._userService.forgotPassword(loginData);

            callback(null, response);
        } catch (error) {
            console.log('mmmmm', error);
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
            callback(grpcError, null);
        }
    };

    changeUserPassword = async (
        call: ServerUnaryCall<forgetData, UserResponse>,
        callback: sendUnaryData<UserResponse>
    ) => {
        try {
            const { email, password } = call.request;

            const response = await this._userService.changeUserPassword({
                email: email,
                password: password,
            });

            callback(null, response);
        } catch (error) {
            console.log('Error in changing password:', error);
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
            callback(grpcError, null);
        }
    };

    updateUserInformation = async (
        call: ServerUnaryCall<forgetData, UserResponse>,
        callback: sendUnaryData<UserResponse>
    ) => {
        try {
            const { email, name, phoneNumber } = call.request;

            const response = await this._userService.updateUserInformation({
                email: email,
                name: name,
                phoneNumber: phoneNumber,
            });

            callback(null, {
                success: response.success,
            });
        } catch (error) {
            console.log('Error in changing user info:', error);
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
            callback(grpcError, null);
        }
    };

    signup = async (
        call: ServerUnaryCall<userData, signupResponse>,
        callback: sendUnaryData<signupResponse>
    ) => {
        const { name, email, password, phone_number, google_id } = call.request;
        const userData = { name, email, password, phone_number, google_id };

        try {
            const response =
                await this._userService.userRegistration(userData);

            const userMessage = new SignupUserMapper(
                response.user
            ).toUserMessage();

            const registerResponse = {
                user: userMessage,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            };

            callback(null, registerResponse);
        } catch (error) {
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
            callback(grpcError, null);
        }
    };
    checkUser = async (
        call: ServerUnaryCall<userData, signupResponse>,
        callback: sendUnaryData<checkResponse>
    ) => {
        try {
            const { email, phoneNumber } = call.request;

            const response = await this._userService.checkUser(
                email,
                phoneNumber
            );

            if (response.success) {
                console.log('response=if==', response);
                callback(null, response);
            } else {
                console.log('response=else==', response);
                callback(null, response);
            }
        } catch (error) {
            console.log('mmmmm', error);
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: (error as Error).message,
            };
            callback(grpcError, null);
        }
    };
}
