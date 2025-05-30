export interface IRegistretionInterFaceRepo{
    saveUser(call:any,callback:any):Promise<any>;
    checkUser(call:any,callback:any):Promise<any>;
}