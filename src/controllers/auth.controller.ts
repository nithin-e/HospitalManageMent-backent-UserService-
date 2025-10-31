import {
    checkResponse,
    LoginResponse,
    signupResponse,
    userData,
    UserResponse,
} from '../entities/user_interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { LoginUserMapper } from '@/dto/LoginUserMapper';
import { SignupUserMapper } from '@/dto/SignupUserMapper';
import { forgetData, HttpStatusCode, LoginUserRequest } from '@/types';
import { IAuthService } from '@/services/interfaces/IAuthk.service';
import { Response, Request } from 'express';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService)
        private readonly _authService: IAuthService
    ) {}

    login = async (req: Request, res: Response) => {
        try {
            const { email, password, googleId, name }: LoginUserRequest =
                req.body;

            const loginData: LoginUserRequest = {
                email,
                password,
                googleId,
                name,
            };
            const response = (await this._authService.userLogin(
                loginData
            )) as LoginResponse;

            const mappedResponse = new LoginUserMapper(
                response
            ).toGrpcResponse();

            res.status(HttpStatusCode.OK).json(mappedResponse);
        } catch (error) {
            console.error('REST login error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email, newPassword } = req.body;
            if (!newPassword) {
                console.error('REST login error:');
            }

            const loginData = { email, newPassword };
            const response = await this._authService.forgotPassword(loginData);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.error('REST forgot password error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    changeUserPassword = async (req: Request, res: Response) => {
        try {
            const { email, password }: forgetData = req.body;

            const response: UserResponse =
                await this._authService.changeUserPassword({
                    email,
                    password,
                });

            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.error('REST changeUserPassword error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    updateUserInformation = async (req: Request, res: Response) => {
        try {
            const { email, name, phoneNumber }: forgetData = req.body;

            const response = await this._authService.updateUserInformation({
                email,
                name,
                phoneNumber,
            });

            const userResponse: UserResponse = { success: response.success };
            res.status(HttpStatusCode.OK).json(userResponse);
        } catch (error) {
            console.error('REST updateUserInformation error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    signup = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phoneNumber, google_id }: userData =
                req.body;
            const userData = { name, email, password, phoneNumber, google_id };

            const response = await this._authService.userRegistration(userData);

            const userMessage = new SignupUserMapper(
                response.user
            ).toUserMessage();

            const registerResponse: signupResponse = {
                user: userMessage,
            };

            res.status(HttpStatusCode.OK).json(registerResponse);
        } catch (error) {
            console.error('REST signup error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    checkUser = async (req: Request, res: Response) => {
        try {
            const { email, phoneNumber }: userData = req.body;

            const response: checkResponse = await this._authService.checkUser(
                email,
                phoneNumber
            );

            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.error('REST checkUser error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };
    handleRefreshToken = async (req: Request, res: Response) => {
        const { token: refreshToken } = req.body;

        if (!refreshToken) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: 'No refresh token provided',
            });
            return;
        }

        const response = await this._authService.refreshTokens(refreshToken);

        if (!response.success) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: response.message,
            });
            return;
        }

        res.status(HttpStatusCode.OK).json(response);
    };
}
