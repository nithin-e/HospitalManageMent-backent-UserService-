import { UserResponse } from "../../entities/user_interface";

export interface IloginInterFace {
    checkingUserExist(userData: {
        email: string;
        password?: string;
        google_id?: string;
        name?: string;
        phoneNumber?: string;
    }): Promise<UserResponse>;
    SetUpForgetPassword(userData:{email:string,newPassword?: string;}):Promise<UserResponse>
    Changing_the__newPassWord(userData:{email:string,newPassword?: string;}):Promise<UserResponse>;
    changing_User___Information(userData:{email:string,name:string; newPassword?: string;phoneNumber: string}):Promise<UserResponse>;
}