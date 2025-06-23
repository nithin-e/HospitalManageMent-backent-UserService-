import { IloginController } from "../interFaces/loginInterFace";
import LoginService from "../../Servicess/implementation/loginService";
import * as grpc from '@grpc/grpc-js';

export default class LoginController implements IloginController {
    private LoginService: LoginService;

    constructor(LoginService:LoginService) {
        this.LoginService =  LoginService;
    }

    login = async (call: any, callback: any) => {
        try {
            console.log('puthya console 1', call.request);
            const { email, password, googleId, name } = call.request;
            
            const loginData = { email, password, googleId, name };
    
            const response = await this.LoginService.user_login(loginData);
    
            if (response.message === 'Invalid credentials') {
                callback(null, { message: response.message });
            } else {
                const registerResponse = {
                    user: response.user,
                    access_token: response.accessToken,   // Changed to snake_case
                    refresh_token: response.refreshToken, // Changed to snake_case
                };
    
               
                callback(null, registerResponse);
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

    
    ForgetPass = async (call: any, callback: any) => {
        try {
            console.log('puthya console 1', call.request);
            const { email, newPassword  } = call.request;
            
            const loginData = { email, newPassword };
    
            const response = await this.LoginService.ForgetPassword(loginData);
            
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


    ChangingUserPassword = async (call: any, callback: any) => {
        try {
            console.log('Change password request:', call.request);
            const { email, password } = call.request;
            
            // Call the service layer function
            const response = await this.LoginService.changeUser_Password({
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


    ChangingUserInfo = async (call: any, callback: any) => {
        try {
            const { email, name, phoneNumber } = call.request;
    
            const response = await this.LoginService.changingUser_Information({
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
    }

}