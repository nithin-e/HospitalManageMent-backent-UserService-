import { UserResponse } from "../../entities/user_interface";


export interface IDoctorPaymentService {
  updateDoctorAndUser(email: string): Promise<UserResponse>;
  deleteDoctorAfterRejection(email: string): Promise<UserResponse>;
}