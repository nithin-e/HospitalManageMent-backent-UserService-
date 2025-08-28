import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { UserResponse } from '../../entities/user_interface';
import { IDoctorPaymentService } from '../../Services/interface/updateDoctorAndUserAfterPayment.interface';



 export interface UpdateDoctor {
  email: string;
}



export interface GrpcRequest {
  request: {
    eventData?: string;
    eventType?: string;
    type?: string;
    data?: {
      object: {
        metadata?: {
          email?: string;
          transactionId?: string;
        };
        [key: string]: any;
      };
    };
  };
}



interface GrpcCall {
  request: any;
}

interface GrpcCallback {
  (error: any, response: any): void;
}



export default class DoctorPaymentController   {
  private readonly _doctorPaymentService: IDoctorPaymentService;

  constructor(doctorPaymentService: IDoctorPaymentService) {
    this._doctorPaymentService = doctorPaymentService;
  }






 handleStripeWebhookUpdateUser  = async (call: GrpcCall, callback: GrpcCallback): Promise<void> => {
    try {

   
      if (!call.request.eventData) {
        callback(null, { 
          success: false, 
          message: 'Empty event data received' 
        });
        return;
      }
      
      const eventData = JSON.parse(call.request.eventData);
      const eventType = call.request.eventType || 'unknown';
      
      const result = await this._doctorPaymentService.handleStripeWebhookUpdateUser(eventType, eventData);
      
      callback(null, result);
    } catch (error) {
      callback(null, { 
        success: false, 
        message: `Error handling webhook: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  }

  deleteDoctorAfterAdminReject  = async (call: ServerUnaryCall<UpdateDoctor,UserResponse>, callback: sendUnaryData<UserResponse>) => {
    try {
      const { email } = call.request;
      const response = await this._doctorPaymentService.deleteDoctorAfterRejection(email);
      callback(null, response);
    } catch (error) {
      console.error('Error updating doctor and user after payment:', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal server error'
      };
      callback(grpcError, null);
    }
  };
}