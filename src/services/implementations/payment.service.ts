import { UserResponse } from '../../entities/user_interface';
import { IPaymentRepository } from '../../repositories/interfaces/IPayment.repository';
import { RabbitMQPublisher } from '../../event/publisher';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { MESSAGES } from '@/constants/messages.constant';
import { IPaymentService } from '../interfaces/IPayment.service';

@injectable()
export default class PaymentService implements IPaymentService {
    constructor(
        @inject(TYPES.DoctorPaymentRepository)
        private _updateDoctorAndUserAfterPaymentRepo: IPaymentRepository
    ) {}

    handleStripeWebhookUpdateUser = async (
        eventType: string,
        eventData: any
    ): Promise<UserResponse> => {
        try {
            const email = eventData.data?.object?.metadata?.email as string;
            const transactionId =
                eventData.data?.object?.metadata?.transactionId;

            if (!email) {
                throw new Error(MESSAGES.PAYMENT.MISSING_METADATA);
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
            console.error(MESSAGES.PAYMENT.WEBHOOK_ERROR, error);
            throw new Error(
                (error as Error).message || MESSAGES.PAYMENT.UPDATE_FAILED
            );
        }
    };

    // deleteDoctorAfterRejection = async (
    //     email: string
    // ): Promise<UserResponse> => {
    //     try {
    //         const response =
    //             await this._updateDoctorAndUserAfterPaymentRepo.deleteDoctorAfterAdminReject(
    //                 email
    //             );
    //         return response;
    //     } catch (error) {
    //         console.error(MESSAGES.PAYMENT.DELETE_FAILED, error);
    //         throw new Error(MESSAGES.PAYMENT.DELETE_FAILED);
    //     }
    // };
}
