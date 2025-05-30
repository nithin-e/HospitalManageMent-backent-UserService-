export interface IUserBlockAndUnblockService{
    BlockingUser(call:any,callback:any):Promise<any>;
    unBlockingUser(call:any,callback:any):Promise<any>;
}