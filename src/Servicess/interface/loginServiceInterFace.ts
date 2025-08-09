import { UserResponse } from "../../entities/user_interface";

type LoginResponse = {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
} | {
  message: string;
};

export interface IloginInerfaceService{
    user_login(loginData: { email: string; password: string }): Promise<LoginResponse>;
    ForgetPassword(loginData: { email: string; newPassword: string }): Promise<UserResponse>;
    changeUser_Password(loginData: { email: string; password: string }):Promise<UserResponse>;
    changingUser_Information(loginData: { email: string; name:string;phoneNumber: string }):Promise<UserResponse>;
}