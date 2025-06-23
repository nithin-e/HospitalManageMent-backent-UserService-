import * as grpc from '@grpc/grpc-js';
import { IfectingAllUsersController } from '../interFaces/fectingAllUsersInterface';
import FectingAllUsersService from '../../Servicess/implementation/fectingAllUsersService';
import { Document, Types } from 'mongoose'; 


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

export default class fetchController implements IfectingAllUsersController {
  private FectingAllUsersService: FectingAllUsersService;

  constructor(FectingAllUsersService: FectingAllUsersService) {
    this.FectingAllUsersService = FectingAllUsersService;
  }

  fetchAllUser = async (call: any, callback: any) => {
    try {
      const response = await this.FectingAllUsersService.fecting_Data();
      console.log('ibde onn nokeee', response);

      // Format the response according to your proto definition
      const formattedResponse: FormattedResponse = {
        users: response.data.map((doc) => ({
          name: doc.name,
          email: doc.email,
          password: doc.password || '',
          phoneNumber: doc.phoneNumber || '',
          googleId: doc.googleId || '',
          role: doc.role || '',
          id: doc._id.toString(), // Convert ObjectId to string
          isActive: doc.isActive
        }))
      };
      
      callback(null, formattedResponse);
    } catch (error) {
      console.log('mmmmm', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message,
      };
      callback(grpcError, null);
    }
  }

  fetchingSingleUserData = async (call: any, callback: any) => {
    try {
      const { email } = call.request;
      const response = await this.FectingAllUsersService.fecting_SingleUser(email);
      console.log('User data retrieved  inside controller bro:', response);

      // Create response object according to proto definition
      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        password: '', // Don't send actual password for security
        phone_number: response.phone_number,
        role: response.role,
        isActive: response.isActive
      };

      // Return the user data in the callback
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


searchUserDebounce = async (call: any, callback: any) => {
  try {
    // Extract all fields from the SearchUsersRequest
    const { 
      searchQuery = '', 
      sortBy = 'createdAt',
      sortDirection = 'desc',
      role = '',
      page = 1,
      limit = 50
    } = call.request;

    console.log('Full request data:', call.request);
    console.log('Search query:', searchQuery);
    console.log('Sort by:', sortBy);
    console.log('Sort direction:', sortDirection);
    console.log('Role filter:', role);
    console.log('Page:', page);
    console.log('Limit:', limit);
    
    // Pass all parameters to the service
    const response = await this.FectingAllUsersService.searchUserDebounce({
      searchQuery,
      sortBy,
      sortDirection,
      role,
      page,
      limit
    });
    
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

}