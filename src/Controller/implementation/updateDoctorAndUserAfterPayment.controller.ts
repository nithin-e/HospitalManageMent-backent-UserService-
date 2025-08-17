import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { UserResponse } from '../../entities/user_interface';
import { IDoctorPaymentService } from '../../Services/interface/updateDoctorAndUserAfterPayment.interface';



 export interface UpdateDoctor {
  email: string;
}


export default class DoctorPaymentController   {
  private UpdateDoctorAndUserAfterPaymentService: IDoctorPaymentService;

  constructor(UpdateDoctorAndUserAfterPaymentService:IDoctorPaymentService) {

    this.UpdateDoctorAndUserAfterPaymentService = UpdateDoctorAndUserAfterPaymentService;
  }

  updateDoctorAndUserAfterPayment  = async (call: ServerUnaryCall<UpdateDoctor,UserResponse>, callback: sendUnaryData<UserResponse>) => {
    try {
      const { email } = call.request;
      const response = await this.UpdateDoctorAndUserAfterPaymentService.updateDoctorAndUser(email);
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


  deleteDoctorAfterAdminReject  = async (call: ServerUnaryCall<UpdateDoctor,UserResponse>, callback: sendUnaryData<UserResponse>) => {
    try {
      const { email } = call.request;
      const response = await this.UpdateDoctorAndUserAfterPaymentService.deleteDoctorAfterRejection(email);
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