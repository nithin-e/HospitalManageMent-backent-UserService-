import { User } from '../../entities/user_schema';
import { DoctorDb } from '../../entities/doctor_schema';
import {  IPaymentRepository } from '../interfaces/IPayment.repository';
import { UserResponse } from '../../entities/user_interface';
import { injectable } from 'inversify';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export default class PaymentRepository implements IPaymentRepository {
    async handleStripeWebhookUpdateUser(email: string): Promise<UserResponse> {
        try {
            const updateRole = await User.findOneAndUpdate(
                { email },
                { $set: { role: 'doctor' } },
                { new: true }
            );

            const updateDoctor = await DoctorDb.findOneAndUpdate(
                { email },
                { $set: { status: 'completed' } },
                { new: true }
            );

            return {
                success: true,
                message: MESSAGES.PAYMENT.UPDATE_SUCCESS,
            };
        } catch (error) {
            console.error(MESSAGES.PAYMENT.UPDATE_FAILED, error);
            throw new Error(MESSAGES.PAYMENT.UPDATE_FAILED);
        }
    }
}
