import { userData, UserResponse } from "../../entities/user_interface";

// export interface IRegisterService{
//     user_registration(userData: userData):Promise<{user: UserResponse;accessToken: string;refreshToken: string;}>;
//     checkUser( email: string,phoneNumber?:string):Promise<UserResponse>;
// }


export interface IRegisterService {
  userRegistration(userData: userData): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  }>;

  checkUser(email: string, phoneNumber?: string): Promise<UserResponse>;
}