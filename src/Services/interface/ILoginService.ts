import { UserResponse } from "../../entities/user_interface";

type LoginResponse =
  | {
      user: UserResponse;
      accessToken: string;
      refreshToken: string;
    }
  | {
      message: string;
    };

export interface ILoginService {
  userLogin(loginData: {
    email: string;
    password: string;
    google_id?: string;
    name?: string;
  }): Promise<LoginResponse>;
  forgotPassword(loginData: {
    email: string;
    newPassword: string;
  }): Promise<UserResponse>;
  changeUserPassword(loginData: {
    email: string;
    password: string;
  }): Promise<UserResponse>;
  updateUserInformation(loginData: {
    email: string;
    name: string;
    phoneNumber: string;
  }): Promise<UserResponse>;
}
