import { UserResponse } from '../../entities/user_interface';

export interface IDoctorPaymentRepository {
    handleStripeWebhookUpdateUser(email: string): Promise<UserResponse>;
    deleteDoctorAfterAdminReject(email: string): Promise<UserResponse>;
}
