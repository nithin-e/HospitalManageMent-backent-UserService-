// Controller
import * as grpc from '@grpc/grpc-js';
import { IUpdateDoctorAndUserAfterPaymentController } from '../interFaces/UpdateDoctorAndUserAfterPaymentInterFace';
import UpdateDoctorAndUserAfterPaymentService from '../../Servicess/implementation/UpdateDoctorAndUserAfterPaymentService'

export default class UpdateDoctorAndUserAfterPaymentController implements IUpdateDoctorAndUserAfterPaymentController {
  private UpdateDoctorAndUserAfterPaymentService: UpdateDoctorAndUserAfterPaymentService;

  constructor(UpdateDoctorAndUserAfterPaymentService:UpdateDoctorAndUserAfterPaymentService) {

    this.UpdateDoctorAndUserAfterPaymentService = UpdateDoctorAndUserAfterPaymentService;
  }

  UpdateDoctorAndUserAfterPayment = async (call: any, callback: any) => {
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


  DeleteDoctorAfter__AdminReject = async (call: any, callback: any) => {
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