// UserBlockAndUnblockController.ts
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import * as grpc from '@grpc/grpc-js';
import { UserResponse } from "../../entities/user_interface";
import { IUserBlockAndUnblockService } from "../../Servicess/interface/UserBlockAndUnblockInterFace";


export interface BlockingUser {
  id:string;
  email:string;
}


export default class UserBlockAndUnblockController  {
  private UserBlockAndUnblockService: IUserBlockAndUnblockService;
  
  constructor(UserBlockAndUnblockService: IUserBlockAndUnblockService) {
    this.UserBlockAndUnblockService = UserBlockAndUnblockService;
  }

  async blockUser(
    call: ServerUnaryCall<BlockingUser, boolean>, 
    callback: sendUnaryData<UserResponse>
  ): Promise<void> {
    try {
      console.log('check this call request',call.request)
      
      const { id:userId } = call.request;
      
      
      // Add null check
      if (!this.UserBlockAndUnblockService) {
        throw new Error('UserBlockAndUnblockService is not initialized');
      }
      
      if (typeof this.UserBlockAndUnblockService.BlockingUser !== 'function') {
        throw new Error('BlockingUser method does not exist on service');
      }
      
      const result = await this.UserBlockAndUnblockService.BlockingUser(userId);
      console.log('Block result:', result);
      
      callback(null, { 
        success: true, 
        message: 'User blocked successfully' 
      });
      
    } catch (error: any) {
      console.error('Error blocking user:', error);
      callback(null, { 
        success: false, 
        message: error.message || 'Failed to block user' 
      });
    }
  }

  async unblockUser(
    call: ServerUnaryCall<BlockingUser, boolean>, 
    callback: sendUnaryData<UserResponse>
  ): Promise<void> {
    try {

      console.log('check this call request',call.request)
      const {id:userId } = call.request;
      
      const result = await this.UserBlockAndUnblockService.unBlockingUser(userId);
      

      callback(null, { 
        success: true, 
        message: 'User unBlocked successfully' 
      });
      // callback(null, { 
      //   result
      // });
      
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      callback(null, { 
        success: false, 
        message: error.message || 'Failed to unblock user' 
      });
    }
  }

  blockDoctor = async (call:ServerUnaryCall<BlockingUser, boolean>, callback: sendUnaryData<UserResponse>) => {
    try {

      console.log('check this call request',call.request)
      const {email}=call.request;

      const response =await this.UserBlockAndUnblockService.BlockingDoctor(email)
      console.log('check here ',response)
      
      callback(null,{success:response} );

    } catch (error) {
          console.error('Error updating doctor and user after payment:', error);
          const grpcError = {
            code: grpc.status.INTERNAL,
            message: error instanceof Error ? error.message : 'Internal server error'
          };
          callback(grpcError, null);
        }
  }
}