import { registration, UserResponse } from "../../entities/user_interface";

export interface IRegistrationRepository {
  saveUser(userData: registration): Promise<UserResponse>;
  checkUser(email: string, phoneNumber: string): Promise<UserResponse>;
}
