import { UserResponse, WebhookEventData } from '../../entities/user_interface';

export interface IPaymentService {
    handleStripeWebhookUpdateUser(
        eventType: string,
        eventData: WebhookEventData
    ): Promise<UserResponse>;
}
