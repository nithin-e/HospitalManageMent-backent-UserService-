import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { UserResponse } from '../../entities/user_interface';
import { IUpdateDoctorAndUserAfterPaymentService } from '../../Servicess/interface/UpdateDoctorAndUserAfterPaymentInterFace';


 export interface UpdateDoctor {
  email: string;
}


export default class UpdateDoctorAndUserAfterPaymentController  {
  private UpdateDoctorAndUserAfterPaymentService: IUpdateDoctorAndUserAfterPaymentService;

  constructor(UpdateDoctorAndUserAfterPaymentService:IUpdateDoctorAndUserAfterPaymentService) {

    this.UpdateDoctorAndUserAfterPaymentService = UpdateDoctorAndUserAfterPaymentService;
  }

  UpdateDoctorAndUserAfterPayment = async (call: ServerUnaryCall<UpdateDoctor,UserResponse>, callback: sendUnaryData<UserResponse>) => {
    try {
      const { email } = call.request;
      const response = await this.UpdateDoctorAndUserAfterPaymentService.updateDoctorAndUserAfterPayment(email);
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


  DeleteDoctorAfter__AdminReject = async (call: ServerUnaryCall<UpdateDoctor,UserResponse>, callback: sendUnaryData<UserResponse>) => {
    try {
      const { email } = call.request;
      const response = await this.UpdateDoctorAndUserAfterPaymentService.DeleteDoctor_AfterAdminReject(email);
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