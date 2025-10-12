import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { UserResponse } from '../entities/user_interface';
import { IDoctorPaymentService } from '../services/interfaces/IPayment.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { GrpcCallResponse, UpdateDoctor } from '@/types';
import { Request,Response } from 'express';



@injectable()
export default class PaymentController {
    constructor(
        @inject(TYPES.DoctorPaymentService)
        private readonly _doctorPaymentService: IDoctorPaymentService
    ) {}

    handleStripeWebhookUpdateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventType, eventData } = req.body;

      if (!eventData) {
        res.status(400).json({
          success: false,
          message: "Empty event data received",
        });
        return;
      }

     
      const parsedEventData = typeof eventData === "string" ? JSON.parse(eventData) : eventData;

      const result = await this._doctorPaymentService.handleStripeWebhookUpdateUser(
        eventType || "unknown",
        parsedEventData
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Error handling Stripe webhook:", error);

    }
  }

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
