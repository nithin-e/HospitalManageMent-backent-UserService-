

export interface IfectingAllUsersService{
    fecting_Data(call:any,callback:any):Promise<any>;
    fecting_SingleUser(call:any,callback:any):Promise<any>;
    searchUserDebounce(call:any,callback:any):Promise<any>;
    
}