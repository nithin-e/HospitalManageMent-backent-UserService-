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
import { ILoginService } from '@/services/interfaces/ILogin.service';
import { Response, Request } from 'express';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService)
        private readonly _userService: ILoginService
    ) {}

    login = async (req: Request, res: Response) => {
        try {
            const { email, password, google_id, name }: LoginUserRequest =
                req.body;

            const loginData: LoginUserRequest = {
                email,
                password,
                google_id,
                name,
            };
            const response = (await this._userService.userLogin(
                loginData
            )) as LoginResponse;

            const mappedResponse = new LoginUserMapper(
                response
            ).toGrpcResponse();

           
            

            res.json(mappedResponse);
        } catch (error) {
            console.error('REST login error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email, newPassword } = req.body;
            if (!newPassword) {
                console.error('REST login error:');
            }

            const loginData = { email, newPassword };
            const response = await this._userService.forgotPassword(loginData);
            res.json(response);
        } catch (error) {
            console.error('REST forgot password error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    changeUserPassword = async (req: Request, res: Response) => {
        try {
            const { email, password }: forgetData = req.body;

            // Call the service layer
            const response: UserResponse =
                await this._userService.changeUserPassword({
                    email,
                    password,
                });

            res.json(response);
        } catch (error) {
            console.error('REST changeUserPassword error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    updateUserInformation = async (req: Request, res: Response) => {
        try {
            const { email, name, phoneNumber }: forgetData = req.body;

            const response = await this._userService.updateUserInformation({
                email,
                name,
                phoneNumber,
            });

            const userResponse: UserResponse = { success: response.success };
            res.json(userResponse);
        } catch (error) {
            console.error('REST updateUserInformation error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    signup = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phone_number, google_id }: userData =
                req.body;
            const userData = { name, email, password, phone_number, google_id };

            const response = await this._userService.userRegistration(userData);

            const userMessage = new SignupUserMapper(
                response.user
            ).toUserMessage();

            const registerResponse: signupResponse = {
                user: userMessage,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            };

            // Send JSON response
            res.json(registerResponse);
        } catch (error) {
            console.error('REST signup error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };

    checkUser = async (req: Request, res: Response) => {
        try {
            const { email, phoneNumber }: userData = req.body;

            const response: checkResponse = await this._userService.checkUser(
                email,
                phoneNumber
            );

            res.json(response);
        } catch (error) {
            console.error('REST checkUser error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    };
}
