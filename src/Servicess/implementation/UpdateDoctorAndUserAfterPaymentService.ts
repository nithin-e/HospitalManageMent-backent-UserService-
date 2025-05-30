import { IUpdateDoctorAndUserAfterPaymentService } from '../interface/UpdateDoctorAndUserAfterPaymentInterFace';
import UpdateDoctorAndUserAfterPaymentRepository from '../../repositoriess/implementation/UpdateDoctorAndUserAfterPaymentRepo';

export default class UpdateDoctorAndUserAfterPaymentService implements IUpdateDoctorAndUserAfterPaymentService {
  private updateDoctorAndUserAfterPaymentRepo: UpdateDoctorAndUserAfterPaymentRepository;
  
  constructor(updateDoctorAndUserAfterPaymentRepo: UpdateDoctorAndUserAfterPaymentRepository) {
    this.updateDoctorAndUserAfterPaymentRepo = updateDoctorAndUserAfterPaymentRepo;
  }
  
  updateDoctorAndUserAfterPayment = async (email: string) => {
    try {
      const response = await this.updateDoctorAndUserAfterPaymentRepo.updateDoctorAndUserAfterPayment(email);
      return response;
    } catch (error) {
      console.error("Error in update doctor and user after payment use case:", error);
      throw error;
    }
  }

  DeleteDoctor_AfterAdminReject = async (email: string) => {
    try {
      const response = await this.updateDoctorAndUserAfterPaymentRepo.DeleteDoctor_After_AdminReject(email);
      return response;
    } catch (error) {
      console.error("Error in update doctor and user after payment use case:", error);
      throw error;
    }
  }
}