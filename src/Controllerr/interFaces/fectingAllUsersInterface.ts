

export interface IfectingAllUsersController{
    fetchAllUser(call:any,callback:any):Promise<any>;
    fetchingSingleUserData(call:any,callback:any):Promise<any>
    searchUserDebounce(call:any,callback:any):Promise<any>
}