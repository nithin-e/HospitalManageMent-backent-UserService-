

export interface IUserBlockAndUnblockController{
    blockUser(call:any,callback:any):Promise<any>;
    unblockUser(call:any,callback:any):Promise<any>;
}