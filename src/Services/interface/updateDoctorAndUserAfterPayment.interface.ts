import { UserResponse } from "../../entities/user_interface";
import { WebhookEventData, WebhookResponse } from "../implementation/updateDoctorAndUserAfterPayment.service";


export interface IDoctorPaymentService {
  handleStripeWebhookUpdateUser(eventType:string,eventData:WebhookEventData): Promise<UserResponse>;
  deleteDoctorAfterRejection(email: string): Promise<UserResponse>;
}