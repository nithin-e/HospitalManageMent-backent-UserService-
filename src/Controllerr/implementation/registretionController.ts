
import * as grpc from '@grpc/grpc-js';
import { IRegisterService } from "../../Servicess/interface/registretionServiceFaceInterFace";
import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import { userData, UserResponse } from "../../entities/user_interface";


export interface signupResponse {
  user: UserResponse;
      accessToken: string;
      refreshToken: string;
}

 export interface checkResponse{
  
 }


export default class RegistrationController {
  private RegistretionService:IRegisterService

  constructor(RegistretionService:IRegisterService) {
    this.RegistretionService = RegistretionService;
  }


  signup = async (call: ServerUnaryCall<userData,signupResponse>, callback: sendUnaryData<signupResponse>) => {

  
    const { name, email, password, phone_number, google_id } = call.request; 

  
    const userData = { name, email, password, phone_number, google_id }; 
  
    try {
      const response = await this.RegistretionService.user_registration(userData);
      
  
      // Construct the User message
      const userMessage = {
        name: response.user.name || response.user._doc?.name,
        email: response.user.email || response.user._doc?.email,
        password: response.user.password || response.user._doc?.password,
        phoneNumber: response.user.phoneNumber || response.user._doc?.phoneNumber,
        id: (response.user._id || response.user._doc?._id)?.toString(),
        createdAt: (response.user.createdAt || response.user._doc?.createdAt)?.toISOString(),
        version: response.user.__v || response.user._doc?.__v || 0,
        googleId: response.user.googleId || response.user._doc?.googleId || '',
        role: response.user.role || response.user._doc?.role
      };

      console.log('...inside controller from user service..', userMessage);
  
  
      // Construct the RegisterResponse message
      const registerResponse = {
        user: userMessage,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
  
      
      callback(null, registerResponse);
    } catch (error) {
      console.log('mmmmm', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message,
      };
      callback(grpcError, null);
    }
  };
  

  CheckUser=async(call: ServerUnaryCall<userData,signupResponse>, callback: sendUnaryData<checkResponse>)=>{
     try {

      const { email,phoneNumber } = call.request;

      
      
      const response = await this.RegistretionService.checkUser(email,phoneNumber)
      

      if (response.success) {
        console.log("response=if==", response);
        callback(null, response)
      } else {
        console.log("response=else==", response);
        callback(null, response);
      }
     } catch (error) {
      console.log('mmmmm', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message
      };
      callback(grpcError, null);
     }
  }
}
