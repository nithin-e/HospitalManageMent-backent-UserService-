import * as grpc from '@grpc/grpc-js';

import { Document, Types } from 'mongoose'; 
import {  IUserService } from '../../Services/interface/fectingAllUsersServiceInterFace';
import { UserDTO } from '../../dto/user.dto';


interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string | null;
  phoneNumber?: string;
  googleId?: string;
  role?: "user" | "admin" | "doctor";
  isActive: boolean;
  createdAt: Date;
}





// interface SearchUserRequest {
//   searchQuery?: string;
//   sortBy?: string;
//   sortDirection?: 'asc' | 'desc';
//   role?: string;
//   page?: number;
//   limit?: number;
// }



interface IGrpcCall {
  request: {
    email?: string;
    appointmentId?: string;
    doctorId?: string;
    patientId?: string;
    roomId?: string;
    doctorName?: string;
    searchQuery?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    role?: string;
    page?: number;
    limit?: number;
  };
}


interface GrpcCallback {
  (error: grpc.ServiceError | null, response?: any): void;
}


interface FormattedUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
    isActive: boolean;
  };
}


interface FormattedUsersResponse {
  users: UserDTO[];
}



export default class UserGrpcController   {
  private readonly _userService: IUserService;

  constructor(userService: IUserService) {
    this._userService = userService;
  }


   getAllUsers = async (call: IGrpcCall, callback: GrpcCallback):Promise<void> => {

    try {
      const response = await this._userService.getAllUsers();
      const formattedResponse: FormattedUsersResponse = {
        users: response,
      };
      callback(null, formattedResponse);
    } catch (error) {
      
     console.log("Error fetching user data in controller:", error);
    }
  }
  

   getUserByEmail = async (call: IGrpcCall, callback: GrpcCallback): Promise<void> => {

    try {
      const { email } = call.request;
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await this._userService.getUserByEmail(email);
      const userData: FormattedUserResponse = {
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          password: "",
          phone_number: response.phone_number,
          role: response.role,
          isActive: response.isActive,
        }
      };
      callback(null, userData);
    } catch (error) {
      console.log("Error fetching user data in controller:", error);
      
     
    }
  }



   searchUsers = async (call: IGrpcCall, callback: GrpcCallback): Promise<void> =>{
  try {

    console.log('check this request while the uer serch something',call.request)
   
    const { 
      searchQuery = '', 
      sortBy = 'createdAt',
      sortDirection = 'desc',
      role = '',
      page = 1,
      limit = 50
    } = call.request;

  
    
    

    const response = await this._userService.searchUsers(
      searchQuery,
      sortBy,
      sortDirection,
      role,
      page,
      limit
    );


    callback(null, response);
  } catch (error) {
    console.log('Error in debounced search:', error);
    // const grpcError = {
    //   code: grpc.status.INTERNAL,
    //   message: (error as Error).message,
    // };
    // callback(grpcError, null);
  }
};



      getUserDetailsViaSocket=async(call: IGrpcCall, callback: GrpcCallback): Promise<void>=>{
  try {
     const { patientId } = call.request;
    
    if (!patientId) {
        throw new Error('Patient ID is required');
      }


 
    const patientResponse = await this._userService.getUserDetailsViaSocket(patientId);

    const userData = {
      id: patientResponse.id,
      name: patientResponse.name,
      email: patientResponse.email,
      isActive: patientResponse.isActive,
      role: patientResponse.role,
      createdAt: patientResponse.createdAt || '',    
    };

    console.log('Patient data retrieved:', userData);
    
    
    callback(null, { user: userData });  
  } catch (error) {
    console.log('Error fetching user data:', error);
    const grpcError = {
      code: grpc.status.INTERNAL,
      message: (error as Error).message,
    };
    // callback(grpcError, null);
  }
}

 searchDoctors = async (call: IGrpcCall, callback: GrpcCallback): Promise<void> => {
    try {
      console.log('Doctor search request:', call.request);
   
      const { 
        searchQuery = '', 
        sortBy = 'createdAt',
        sortDirection = 'desc',
        page = 1,
        limit = 50
      } = call.request;


      const response = await this._userService.searchDoctors(
        searchQuery,
        sortBy,
        sortDirection,
        page,
        limit
      );

      console.log('check this reps in controller',response);
      

      callback(null, response);
    } catch (error) {
      console.log('Error in doctor search:', error);
      const grpcError = {
        code: 13, // INTERNAL error code
        message: (error as Error).message,
      };
      // callback(grpcError, null);
    }
  };

}