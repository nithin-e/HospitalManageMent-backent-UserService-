// UserBlockAndUnblockController.ts
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import { UserResponse } from "../../entities/user_interface";
import { IUserBlockAndUnblockService } from "../../services/interface/IBlockAndUnblockservice.";
import { BlockingUser } from "src/interfaces/types";

export default class UserBlockController {
  private readonly _userBlockAndUnblockService: IUserBlockAndUnblockService;

  constructor(userBlockAndUnblockService: IUserBlockAndUnblockService) {
    this._userBlockAndUnblockService = userBlockAndUnblockService;
  }
  async blockUser(
    call: ServerUnaryCall<BlockingUser, boolean>,
    callback: sendUnaryData<UserResponse>
  ): Promise<void> {
    try {
      console.log("check this call request", call.request);

      const { id: userId } = call.request;

      // Add null check
      if (!this._userBlockAndUnblockService) {
        throw new Error("UserBlockAndUnblockService is not initialized");
      }

      if (typeof this._userBlockAndUnblockService.blockDoctor !== "function") {
        throw new Error("BlockingUser method does not exist on service");
      }

      const result = await this._userBlockAndUnblockService.blockDoctor(userId);
      console.log("Block result:", result);

      callback(null, {
        success: true,
        message: "User blocked successfully",
      });
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  }

  async unblockUser(
    call: ServerUnaryCall<BlockingUser, boolean>,
    callback: sendUnaryData<UserResponse>
  ): Promise<void> {
    try {
      console.log("check this call request", call.request);
      const { id: userId } = call.request;

      const result = await this._userBlockAndUnblockService.unblockUser(userId);

      callback(null, {
        success: true,
        message: "User unBlocked successfully",
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  }

  blockDoctor = async (
    call: ServerUnaryCall<BlockingUser, boolean>,
    callback: sendUnaryData<UserResponse>
  ) => {
    try {
      console.log("check this call request", call.request);
      const { email } = call.request;

      const response = await this._userBlockAndUnblockService.blockDoctor(
        email
      );
      console.log("check here ", response);

      callback(null, { success: response });
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
