import { User } from "../../entities/user_schema";
import { DoctorDb } from "../../entities/doctor_schema";
import { IUserBlockAndUnblockRepository } from "../interface/IBlockAndUnblockRepository.";
import { BaseRepository } from "./baseRepository";
import type { User as UserType } from "../../entities/user_schema";

export default class UserBlockRepository
  extends BaseRepository<UserType>
  implements IUserBlockAndUnblockRepository
{
  constructor() {
    super(User);
  }

  async blockUser(userId: string): Promise<boolean> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      console.log("Before update:", user.toObject());

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );

      console.log("After update:", updatedUser?.toObject());

      return true;
    } catch (error) {
      console.error("Error blocking user in repository:", error);
      throw error;
    }
  }

  async unblockUser(userId: string): Promise<boolean> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      console.log("Before update:", user.toObject());

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: true },
        { new: true }
      );

      console.log("After update:", updatedUser?.toObject());

      return true;
    } catch (error) {
      console.error("Error unblocking user in repository:", error);
      throw error;
    }
  }

  async blockDoctor(doctorEmail: string): Promise<boolean> {
    try {
      const result = await DoctorDb.updateOne(
        { email: doctorEmail },
        { $set: { isActive: false } }
      );

      return true;
    } catch (error) {
      console.error("Error blocking doctor in repository:", error);
      throw error;
    }
  }
}
