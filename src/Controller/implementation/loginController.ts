import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { LoginUserRequest } from "../../allTypes/types";
import { LoginResponse, UserResponse } from "../../entities/user_interface";
import {  ILoginService } from "../../Services/interface/loginServiceInterFace";

export interface LoginUserResponse {
    message?: string;
    user?: UserResponse;
    access_token?: string;
    refresh_token?: string;
}

export interface forgetData{
email:string;
newPassword?:string | null;
password:string;
name:string
phoneNumber:string
}



export default class LoginController   {
    private readonly LoginService: ILoginService;

    constructor(LoginService: ILoginService) {
        this.LoginService = LoginService;
    }

    login  = async (
        call: ServerUnaryCall<LoginUserRequest, LoginUserResponse>,
        callback: sendUnaryData<LoginUserResponse>
    ): Promise<void> => {
        try {
            const { email, password } = call.request;
            
            const loginData: LoginUserRequest = {
                email,
                password
            };
    
            const response = await this.LoginService.userLogin(loginData) as LoginResponse;
    
            console.log('Login successful:', response);
    
            if (!response.success || !response || response.message === 'Invalid credentials') {
                console.log('Login failed:', response);
                const errorResponse: LoginUserResponse = {
                    message: response.message || 'Login failed'
                };
                callback(null, errorResponse);
                return;
            }
    
            // Fix: Access properties directly from response, not response.data
            const successResponse: LoginUserResponse = {
                user: {
                    _id: response.user._id,
                    email: response.user.email,
                    name: response.user.name || '',
                    role: response.user.role,
                    phoneNumber: response.user.phoneNumber || '',
                    googleId: response.user.googleId || '',
                    createdAt: response.user.createdAt || new Date(),
                    isActive:response.user.isActive
                },
                access_token: response.accessToken,  
                refresh_token: response.refreshToken  
            };
    
            callback(null, successResponse);
        } catch (error) {
            console.error('Controller error:', error);
            const grpcError: ServiceError = {
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Unknown error',
                name: 'Internal Error',
                details: '',
                metadata: new grpc.Metadata()
            };
            callback(grpcError, null);
        }
    };


    forgotPassword  = async (call: ServerUnaryCall<forgetData, UserResponse>,callback: sendUnaryData<UserResponse>) => {
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
            
            const loginData = { email, newPassword }; // Now newPassword is guaranteed to be string
            const response = await this.LoginService.forgotPassword(loginData);
            
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


    changeUserPassword  = async (call: ServerUnaryCall<forgetData, UserResponse>,callback: sendUnaryData<UserResponse>) => {
        try {
          
            const { email, password } = call.request;
            
            // Call the service layer function
            const response = await this.LoginService.changeUserPassword({
                email: email,
                password: password
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


    updateUserInformation  = async (call: ServerUnaryCall<forgetData, UserResponse>,callback: sendUnaryData<UserResponse>) => {
        try {
            const { email, name, phoneNumber } = call.request;
    
            const response = await this.LoginService.updateUserInformation({
                email: email,
                name: name,
                phoneNumber: phoneNumber
            });
    
            callback(null, {
                success: response.success
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

}