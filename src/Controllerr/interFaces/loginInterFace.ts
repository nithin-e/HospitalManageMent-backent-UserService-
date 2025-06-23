export interface IloginController{
    login(call:any,callback:any):Promise<void>;
    ForgetPass(call:any,callback:any):Promise<void>;
    ChangingUserPassword(call:any,callback:any):Promise<void>;
    ChangingUserInfo(call:any,callback:any):Promise<void>;
}