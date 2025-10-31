import { IDoctorPaymentService } from '../interfaces/IPayment.service';
import { UserResponse, WebhookEventData } from '../../entities/user_interface';
import { IDoctorPaymentRepository } from '../../repositories/interfaces/IPayment.repository';
import { RabbitMQPublisher } from '../../event/publisher';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';

@injectable()
export default class PaymentService implements IDoctorPaymentService {
    constructor(
        @inject(TYPES.DoctorPaymentRepository)
        private _updateDoctorAndUserAfterPaymentRepo: IDoctorPaymentRepository
    ) {}

    handleStripeWebhookUpdateUser = async (
        eventType: string,
        eventData: any 
    ): Promise<UserResponse> => {
        try {
            const email = eventData.metadata?.email as string;
            const transactionId = eventData.metadata?.transactionId;

            if (!email) {
                throw new Error('Missing email in Stripe metadata');
            }

            const response =
                await this._updateDoctorAndUserAfterPaymentRepo.handleStripeWebhookUpdateUser(
                    email
                );

            RabbitMQPublisher.publish('user.notification', {
                email,
                transactionId,
            });

            return response;
        } catch (error) {
            console.error(
                'Error in update doctor and user after payment use case:',
                error
            );
            throw error;
        }
    };

    deleteDoctorAfterRejection = async (
        email: string
    ): Promise<UserResponse> => {
        try {
            const response =
                await this._updateDoctorAndUserAfterPaymentRepo.deleteDoctorAfterAdminReject(
                    email
                );
            return response;
        } catch (error) {
            console.error(
                'Error in update doctor and user after payment use case:',
                error
            );
            throw error;
        }
    };
}
