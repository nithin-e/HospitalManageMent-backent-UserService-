import {
    checkResponse,
    userData,
    UserResponse,
} from '../entities/user_interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { forgetData, HttpStatusCode, LoginUserRequest } from '@/types';
import { IAuthService } from '@/services/interfaces/IAuthk.service';
import { Response, Request } from 'express';
import { MESSAGES } from '@/constants/messages.constant';

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

            const mappedResponse = await this._authService.userLogin(loginData);

            res.status(HttpStatusCode.OK).json(mappedResponse);
        } catch (error) {
            res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.ERROR.LOGIN_FAILED,
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
            console.error('error:', error);
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
            console.error('error:', error);
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
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    signup = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phoneNumber, google_id }: userData =
                req.body;

            const response = await this._authService.userRegistration({
                name,
                email,
                password,
                phoneNumber,
                google_id,
            });

            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.ERROR.REGISTER_FAILED,
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
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    };

    handleRefreshToken = async (req: Request, res: Response): Promise<void> => {
        const { token: refreshToken } = req.body;

        if (!refreshToken) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.NO_REFRESH_TOKEN,
            });
            return;
        }

        const response = await this._authService.refreshTokens(refreshToken);

        if (!response.success) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: response.message || MESSAGES.AUTH.TOKEN_INVALID,
            });
            return;
        }

        res.status(HttpStatusCode.OK).json(response);
    };
}
