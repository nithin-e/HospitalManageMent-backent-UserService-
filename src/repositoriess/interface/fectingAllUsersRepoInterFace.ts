import { SearchParams } from "../../allTypes/types";

export interface IfectingAllUsersRepository{
    fetchingAllUserData():Promise<any>;
    fetching_a__SingleUser(email:string):Promise<any>;
    searchUserDebounce(params:SearchParams):Promise<any>;
    fecthing_UserDetails__ThroughSocket(patientId:string):Promise<any>
   
 
}