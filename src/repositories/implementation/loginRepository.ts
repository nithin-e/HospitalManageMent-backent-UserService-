import bcrypt from "../../utility/bcrypt";
import { User } from "../../entities/user_schema";
import { UserResponse } from "../../entities/user_interface";
import { ILoginRepository } from "../interface/ILoginRepository";
import type { User as UserType } from "../../entities/user_schema";
import { BaseRepository } from "./baseRepository";

export default class LoginRepository
  extends BaseRepository<UserType>
  implements ILoginRepository
{
  constructor() {
    super(User);
  }

  checkUserExists = async (userData: {
    email: string;
    password?: string;
    google_id?: string;
    name?: string;
    phoneNumber?: string;
  }): Promise<UserResponse> => {
    try {
      if (userData.google_id) {
        console.log("Google auth flow detected...");

        let existingUser = await this.findByEmail(userData.email);

        if (!existingUser) {
          console.log("Creating new Google user...");
          existingUser = await this.create({
            email: userData.email,
            googleId: userData.google_id,
            password: userData.password || "",
            name: userData.name || "",
            phoneNumber: userData.phoneNumber || "",
            role: "user",
          } as any);
        } else {
          existingUser.googleId = userData.google_id;
          await existingUser.save();
        }

        return existingUser as UserResponse;
      }

      const existingUser = await this.findByEmail(userData.email);
      console.log("......inside repo....", existingUser);

      if (!existingUser) {
        return { success: false, error: "Invalid credentials" };
      }

      const isPasswordValid = await bcrypt.matchPassword(
        userData.password || "",
        existingUser.password || ""
      );

      if (!isPasswordValid) {
        console.log("ullil kerindo", isPasswordValid);

        return { success: false, error: "Invalid credentials" };
      }

      return existingUser as UserResponse;
    } catch (error) {
      console.error("Login error in repo:", error);
      throw error;
    }
  };

  setUpForgotPassword = async (userData: {
    email: string;
    newPassword?: string;
  }): Promise<UserResponse> => {
    try {
      console.log("......inside repo....", userData);
      const { email } = userData;

      // Find user by email
      const user = await this.findOne({ email });

      console.log("are u able to find the user", user);

      if (!user) {
        return {
          success: false,
        };
      }

      // Update password if provided
      if (userData.newPassword) {
        user.password = userData.newPassword;
        await user.save();
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error in forget password repo:", error);
      throw error;
    }
  };

  changePassword = async (userData: {
    email: string;
    newPassword?: string;
  }): Promise<UserResponse> => {
    try {
      console.log("Repository function called with:", userData);

      const { email } = userData;
      // Find user by email
      const user = await this.findOne({ email });

      if (!user) {
        return {
          success: false,
        };
      }

      if (userData.newPassword) {
        user.password = userData.newPassword;
        await user.save();
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error in change password repository:", error);
      throw error;
    }
  };

  updateUserInformation = async (userData: {
    email: string;
    name: string;
    phoneNumber: string;
  }): Promise<UserResponse> => {
    try {
      console.log("Repository function called with:", userData);

      // Find and update user by email
      const updatedUser = await User.findOneAndUpdate(
        { email: userData.email },
        {
          name: userData.name,
          phone_number: userData.phoneNumber,
        },
        { new: true }
      );

      if (!updatedUser) {
        return {
          success: false,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error in change user information repository:", error);
      throw error;
    }
  };
}
