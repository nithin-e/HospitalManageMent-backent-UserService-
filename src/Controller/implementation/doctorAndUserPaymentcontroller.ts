import { ServerUnaryCall, sendUnaryData, ServiceError } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import { UserResponse } from "../../entities/user_interface";
import { IDoctorPaymentService } from "../../services/interface/IDoctorAndUserPaymentService";
import { GrpcCallResponse, UpdateDoctor } from "src/interfaces/types";

interface GrpcCall {
  request: any;
}

export default class DoctorPaymentController {
  private readonly _doctorPaymentService: IDoctorPaymentService;

  constructor(doctorPaymentService: IDoctorPaymentService) {
    this._doctorPaymentService = doctorPaymentService;
  }

  handleStripeWebhookUpdateUser = async (
    call: GrpcCall,
    callback: GrpcCallResponse
  ): Promise<void> => {
    try {
      if (!call.request.eventData) {
        callback(null, {
          success: false,
          message: "Empty event data received",
        });
        return;
      }

      const eventData = JSON.parse(call.request.eventData);
      const eventType = call.request.eventType || "unknown";

      const result =
        await this._doctorPaymentService.handleStripeWebhookUpdateUser(
          eventType,
          eventData
        );

      callback(null, result);
    } catch (error) {
      callback(null, {
        success: false,
        message: `Error handling webhook: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  deleteDoctorAfterAdminReject = async (
    call: ServerUnaryCall<UpdateDoctor, UserResponse>,
    callback: sendUnaryData<UserResponse>
  ) => {
    try {
      const { email } = call.request;
      const response =
        await this._doctorPaymentService.deleteDoctorAfterRejection(email);
      callback(null, response);
    } catch (error) {
      console.error("Error updating doctor and user after payment:", error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message:
          error instanceof Error ? error.message : "Internal server error",
      };
      callback(grpcError, null);
    }
  };
}
