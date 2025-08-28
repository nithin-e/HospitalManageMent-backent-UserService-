import { IDoctorPaymentService } from '../interface/updateDoctorAndUserAfterPayment.interface';
import { UserResponse } from '../../entities/user_interface';
import { IDoctorPaymentRepository } from '../../repositories/interface/updateDoctorAndUserAfterPayment.interface';
import { RabbitMQPublisher } from '../../event/publisher';


export interface WebhookEventData {
  type: string;
  data: {
    object: {
      metadata?: {
        email?: string;
        transactionId?: string;
      };
      [key: string]: any;
    };
  };
}

export interface WebhookResponse {
  success: boolean;
  message: string;
}

export default class UpdateDoctorAndUserAfterPaymentService  implements IDoctorPaymentService {
  private _updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository;

  constructor(updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository) {
    this._updateDoctorAndUserAfterPaymentRepo =
      updateDoctorAndUserAfterPaymentRepo;
  }
  
 



  handleStripeWebhookUpdateUser=async(eventType:string,eventData:WebhookEventData):Promise<UserResponse>=>{
  
    try {

            const email = eventData.data.object.metadata?.email as string;
          const transactionId = eventData.data.object.metadata?.transactionId;
            const response = await this._updateDoctorAndUserAfterPaymentRepo.handleStripeWebhookUpdateUser(email);
            RabbitMQPublisher.publish("user.notification",{
              email,
              transactionId
            })

          return response;
    } catch (error) {
       console.error("Error in update doctor and user after payment use case:", error);
      throw error;
    }

  }


  deleteDoctorAfterRejection = async (email: string):Promise <UserResponse> => {
    try {
      const response = await this._updateDoctorAndUserAfterPaymentRepo.deleteDoctorAfterAdminReject(email);
      return response;
    } catch (error) {
      console.error("Error in update doctor and user after payment use case:", error);
      throw error;
    }
  }
}