import { IregistretionInterFaceController } from "../interFaces/registretionControllerInterface";
import RegistretionService from '../../Servicess/implementation/registretionService'
import * as grpc from '@grpc/grpc-js';
import { IRegisterService } from "../../Servicess/interface/registretionServiceFaceInterFace";


export default class RegistrationController implements IregistretionInterFaceController{
  private RegistretionService:IRegisterService

  constructor(RegistretionService:IRegisterService) {
    this.RegistretionService = RegistretionService;
  }
  signup = async (call: any, callback: any) => {
    console.log('Raw gRPC request:', call.request);
  
    const { name, email, password, phone_number, google_id } = call.request; 
    console.log('Destructured data:', { name, email, password, phone_number, google_id });
  
    const userData = { name, email, password, phone_number, google_id }; // Added googleId
  
    try {
      const response = await this.RegistretionService.user_registration(userData);
      console.log('.....', response.user);
  
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
  
      // Pass the serialized response to the callback
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
  

  CheckUser=async(call: any, callback: any)=>{
     try {

      const { email,phoneNumber } = call.request;

      
      
      const response = await this.RegistretionService.checkUser(email,phoneNumber)
      console.log("response===", response);

      if (response.message === "user not registered") {
        
       console.log('hey hey hey avasanam controllerk ethi lele')

      //  const token = await sendOtp(email, name)

        callback(null, response)
       
       
        
      } else {
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
