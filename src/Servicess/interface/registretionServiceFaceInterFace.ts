export interface IRegisterService{
    user_registration(call:any,callback?:any):Promise<any>;
    checkUser(call:any,callback?:any):Promise<any>;
}