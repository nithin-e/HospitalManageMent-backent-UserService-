export interface IloginInerfaceService{
    user_login(call:any,callback:any):Promise<any>;
    ForgetPassword(call:any,callback:any):Promise<any>;
    changeUser_Password(call:any,callback:any):Promise<any>;
}