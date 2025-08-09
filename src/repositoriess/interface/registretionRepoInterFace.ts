import { registration, UserResponse } from "../../entities/user_interface";

export interface IRegistretionInterFaceRepo{
    saveUser(userData: registration):Promise<UserResponse>;
    checkUser(email: string, phoneNumber: string):Promise<UserResponse>;
}