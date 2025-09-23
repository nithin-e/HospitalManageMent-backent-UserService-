import { UserResponse, WebhookEventData } from "../../entities/user_interface";

export interface IDoctorPaymentService {
  handleStripeWebhookUpdateUser(
    eventType: string,
    eventData: WebhookEventData
  ): Promise<UserResponse>;
  deleteDoctorAfterRejection(email: string): Promise<UserResponse>;
}
