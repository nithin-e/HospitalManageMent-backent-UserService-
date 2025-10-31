import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { UserResponse, WebhookEventData } from '../entities/user_interface';
import { IDoctorPaymentService } from '../services/interfaces/IPayment.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { HttpStatusCode, PaymentEvent, UpdateDoctor } from '@/types';
import { Request, Response } from 'express';

@injectable()
export default class PaymentController {
    constructor(
        @inject(TYPES.DoctorPaymentService)
        private readonly _doctorPaymentService: IDoctorPaymentService
    ) {}

    

handleStripeWebhookUpdateUser = async (message: PaymentEvent): Promise<void> => {
  try {
    const eventType = message.type || 'unknown';
    const eventData = message.data;

    if (!eventData) {
      console.warn('⚠️ Received empty event data in consumer');
      return;
    }

    const formattedEvent: WebhookEventData = {
      type: eventType,
      data: {
        object: {
          metadata: eventData.metadata,
          customer_details: eventData.customer_details,
          id: eventData.id,
          amount_total: eventData.amount_total,
          currency: eventData.currency,
        },
      },
    };

    await this._doctorPaymentService.handleStripeWebhookUpdateUser(
      eventType,
      formattedEvent
    );

    console.log('✅ User updated successfully from payment event');
  } catch (error) {
    console.error('❌ Error processing payment.user event:', error);
  }
};


    deleteDoctorAfterAdminReject = async (
        call: ServerUnaryCall<UpdateDoctor, UserResponse>,
        callback: sendUnaryData<UserResponse>
    ) => {
        try {
            const { email } = call.request;
            const response =
                await this._doctorPaymentService.deleteDoctorAfterRejection(
                    email
                );
            callback(null, response);
        } catch (error) {
            console.error(
                'Error updating doctor and user after payment:',
                error
            );
            const grpcError = {
                code: grpc.status.INTERNAL,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
            };
            callback(grpcError, null);
        }
    };
}
