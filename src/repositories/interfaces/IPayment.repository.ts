import { UserResponse } from '../../entities/user_interface';

export interface IPaymentRepository {
    handleStripeWebhookUpdateUser(email: string): Promise<UserResponse>;
}
