import { IDoctorPaymentService } from '../interface/updateDoctorAndUserAfterPayment.interface';
import { UserResponse } from '../../entities/user_interface';
import { IDoctorPaymentRepository } from '../../repositories/interface/updateDoctorAndUserAfterPayment.interface';


export default class UpdateDoctorAndUserAfterPaymentService  implements IDoctorPaymentService {
  private updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository;
  
  constructor(updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository) {
    this.updateDoctorAndUserAfterPaymentRepo = updateDoctorAndUserAfterPaymentRepo;
  }
  
  updateDoctorAndUser = async (email: string):Promise<UserResponse> => {
    try {
      const response = await this.updateDoctorAndUserAfterPaymentRepo.updateDoctorAndUserAfterPayment(email);
      return response;
    } catch (error) {
      console.error("Error in update doctor and user after payment use case:", error);
      throw error;
    }
  }

  deleteDoctorAfterRejection = async (email: string):Promise <UserResponse> => {
    try {
      const response = await this.updateDoctorAndUserAfterPaymentRepo.deleteDoctorAfterAdminReject(email);
      return response;
    } catch (error) {
      console.error("Error in update doctor and user after payment use case:", error);
      throw error;
    }
  }
}