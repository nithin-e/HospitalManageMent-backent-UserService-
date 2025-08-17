import { UserResponse } from "../../entities/user_interface";

export interface IDoctorPaymentRepository {
    updateDoctorAndUserAfterPayment(email: string): Promise<UserResponse>;
    deleteDoctorAfterAdminReject(email: string): Promise<UserResponse>;
}
