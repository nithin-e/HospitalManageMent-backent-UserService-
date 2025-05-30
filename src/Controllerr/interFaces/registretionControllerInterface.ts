export interface IregistretionInterFaceController{
    signup(call:any,callback:any):Promise<any>;
    CheckUser(call:any,callback:any):Promise<any>;
}