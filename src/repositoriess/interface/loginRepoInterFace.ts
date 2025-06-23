export interface IloginInterFace{
    checkingUserExist(call:any,callback:any):Promise<any>;
    SetUpForgetPassword(call:any,callback:any):Promise<any>;
    Changing_the__newPassWord(call:any,callback:any):Promise<any>;
    changing_User___Information(call:any,callback:any):Promise<any>;
}