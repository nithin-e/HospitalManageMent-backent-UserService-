import * as grpc from '@grpc/grpc-js';

import { Document, Types } from 'mongoose'; 
import { IfectingAllUsersService } from '../../Servicess/interface/fectingAllUsersServiceInterFace';


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



// Output format for the gRPC response
interface FormattedUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  googleId: string;
  role: string;
  id: string;
  isActive: boolean;
}

interface FormattedResponse {
  users: FormattedUser[];
}

interface SearchUserRequest {
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  role?: string;
  page?: number;
  limit?: number;
}

export default class fetchController  {
  private FectingAllUsersService: IfectingAllUsersService;

  constructor(FectingAllUsersService: IfectingAllUsersService) {
    this.FectingAllUsersService = FectingAllUsersService;
  }

  fetchAllUser = async (call: any, callback: any) => {
    try {
      const response = await this.FectingAllUsersService.fecting_Data();
  
      const formattedResponse = {
        users: response,
      };
  
      callback(null, formattedResponse);
    } catch (error) {
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message,
      };
      callback(grpcError, null);
    }
  };
  

  fetchingSingleUserData = async (call: any, callback: any) => {
    try {
      const { email } = call.request;
  
      const response = await this.FectingAllUsersService.fecting_SingleUser(email);
  
      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        password: "", // mask
        phone_number: response.phone_number,
        role: response.role,
        isActive: response.isActive,
      };
  
      callback(null, { user: userData });
    } catch (error) {
      console.log("Error fetching user data in controller:", error);
      callback({ code: grpc.status.INTERNAL, message: (error as Error).message }, null);
    }
}


// searchUserDebounce = async (call: any, callback: any) => {
  searchUserDebounce = async (call: { request: SearchUserRequest }, callback: (error: any, response: any) => void) => {

  try {
   
    const { 
      searchQuery = '', 
      sortBy = 'createdAt',
      sortDirection = 'desc',
      role = '',
      page = 1,
      limit = 50
    } = call.request;

  
    
    // Pass all parameters to the service
    const response = await this.FectingAllUsersService.searchUserDebounce(
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
    const grpcError = {
      code: grpc.status.INTERNAL,
      message: (error as Error).message,
    };
    callback(grpcError, null);
  }
};



fecthingUserDetails_ThroughSocket = async (call: any, callback: any) => {
  try {
    const { appointmentId, doctorId, patientId, roomId, doctorName } = call.request;
    
    console.log('Received request data:', {
      appointmentId,
      doctorId,
      patientId,
      roomId,
      doctorName
    });

    // Fetch only patient details using patientId
    const patientResponse = await this.FectingAllUsersService.fecthingUserDetails__ThroughSocket(patientId);

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
    callback(grpcError, null);
  }
}

}