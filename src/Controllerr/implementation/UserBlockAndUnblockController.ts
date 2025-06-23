// UserBlockAndUnblockController.ts
import { IUserBlockAndUnblockController } from "../interFaces/UserBlockAndUnblockInterface";
import UserBlockAndUnblockService from '../../Servicess/implementation/UserBlockAndUnblockService'
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";

export default class UserBlockAndUnblockController implements IUserBlockAndUnblockController {
  private UserBlockAndUnblockService: UserBlockAndUnblockService;
  
  constructor(UserBlockAndUnblockService: UserBlockAndUnblockService) {
    console.log('🔍 Controller Constructor - Received service:', UserBlockAndUnblockService);
    console.log('🔍 Service methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(UserBlockAndUnblockService)));
    
    this.UserBlockAndUnblockService = UserBlockAndUnblockService;
    
    console.log('🔍 Controller Constructor - Service assigned:', this.UserBlockAndUnblockService);
  }

  async blockUser(
    call: ServerUnaryCall<any, any>, 
    callback: sendUnaryData<any>
  ): Promise<void> {
    try {
      console.log('🔍 Block User - Service check:', this.UserBlockAndUnblockService);
      console.log('🔍 Block User - BlockingUser method exists:', typeof this.UserBlockAndUnblockService?.BlockingUser);
      
      const { id: userId } = call.request;
      console.log('Extracted user id:', userId);
      
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
    call: ServerUnaryCall<any, any>, 
    callback: sendUnaryData<any>
  ): Promise<void> {
    try {
      const { id: userId } = call.request;
      
     console.log('check up the user id is getting or not ',userId);
     
     
      
     
      const result = await this.UserBlockAndUnblockService.unBlockingUser(userId);
      
      callback(null, { 
        success: true, 
        message: 'User unblocked successfully' 
      });
      
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      callback(null, { 
        success: false, 
        message: error.message || 'Failed to unblock user' 
      });
    }
  }
}