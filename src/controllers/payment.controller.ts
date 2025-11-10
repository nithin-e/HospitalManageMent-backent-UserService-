import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { UserResponse, WebhookEventData } from '../entities/user_interface';
import { IPaymentService } from '../services/interfaces/IPayment.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { PaymentEvent, UpdateDoctor } from '@/types';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export default class PaymentController {
    constructor(
        @inject(TYPES.DoctorPaymentService)
        private readonly _doctorPaymentService: IPaymentService
    ) {}

    handleStripeWebhookUpdateUser = async (
        message: PaymentEvent
    ): Promise<void> => {
        try {
            const eventType = message.type || 'unknown';
            const eventData = message.data;

            if (!eventData) {
                console.warn(MESSAGES.PAYMENT.MISSING_METADATA);
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
        } catch (error) {
            console.error(MESSAGES.PAYMENT.WEBHOOK_ERROR, error);
        }
    };
}
