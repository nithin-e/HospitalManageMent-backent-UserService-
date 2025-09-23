import { IDoctorPaymentService } from "../interface/IDoctorAndUserPaymentService";
import { UserResponse, WebhookEventData } from "../../entities/user_interface";
import { IDoctorPaymentRepository } from "../../repositories/interface/IDoctorAndUserPaymentRepository";
import { RabbitMQPublisher } from "../../event/publisher";

export default class UpdateDoctorAndUserAfterPaymentService
  implements IDoctorPaymentService
{
  private _updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository;

  constructor(updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository) {
    this._updateDoctorAndUserAfterPaymentRepo =
      updateDoctorAndUserAfterPaymentRepo;
  }

  handleStripeWebhookUpdateUser = async (
    eventType: string,
    eventData: WebhookEventData
  ): Promise<UserResponse> => {
    try {
      const email = eventData.data.object.metadata?.email as string;
      const transactionId = eventData.data.object.metadata?.transactionId;
      const response =
        await this._updateDoctorAndUserAfterPaymentRepo.handleStripeWebhookUpdateUser(
          email
        );
      RabbitMQPublisher.publish("user.notification", {
        email,
        transactionId,
      });

      return response;
    } catch (error) {
      console.error(
        "Error in update doctor and user after payment use case:",
        error
      );
      throw error;
    }
  };

  deleteDoctorAfterRejection = async (email: string): Promise<UserResponse> => {
    try {
      const response =
        await this._updateDoctorAndUserAfterPaymentRepo.deleteDoctorAfterAdminReject(
          email
        );
      return response;
    } catch (error) {
      console.error(
        "Error in update doctor and user after payment use case:",
        error
      );
      throw error;
    }
  };
}
