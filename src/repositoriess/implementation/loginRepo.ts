import bcrypt from "../../services/bcrypt"; // Make sure this is your bcrypt wrapper
import {User} from '../../entities/user_schema'
import { UserResponse } from "../../entities/user_interface";
import { IloginInterFace } from "../interface/loginRepoInterFace";




export default class loginRepository implements IloginInterFace{

  checkingUserExist = async (userData: {
    email: string;
    password?: string;
    googleId?: string;
    name?:string;
    phoneNumber?:string;
  }): Promise<UserResponse> => {
    try {
      // Handle Google user login/registration
      if (userData.googleId) {
        console.log('Google auth flow detected...');
        
        // Find or create user
        let existingUser = await User.findOne({ email: userData.email });
        
        if (!existingUser) {
          // Create new user with Google data
          console.log('Creating new Google user...');
          existingUser = new User({
            email: userData.email,
            googleId: userData.googleId,
            password:userData.password || '',
            name: userData.name || '',
            phoneNumber: userData.phoneNumber || '',
            role: 'user'
          });
        } else {
          existingUser.googleId = userData.googleId;
        }
        
        // Save user and return
        await existingUser.save();
        return existingUser as UserResponse;
      }
      
      // Regular password-based authentication
      const existingUser = await User.findOne({ email: userData.email });
      console.log('......inside repo....', existingUser);
      
      if (!existingUser) {
        console.log('...!existing user...');
        return {
          success: false,
          error: "Invalid credentials",
        };
      }
  
      const isPasswordValid = await bcrypt.matchPassword(
        userData.password || '',
        existingUser.password || ''
      );
      
      if (!isPasswordValid) {
        console.log('...!password...');
        return {
          success: false,
          error: "Invalid credentials",
        };
      }
  
      return existingUser as UserResponse;
    } catch (error) {
      console.error("Login error in repo:", error);
      throw error;
    }
  };



  SetUpForgetPassword = async (userData: {
    email: string;
    newPassword?: string;
  }): Promise<UserResponse> => {
    try {
      console.log('......inside repo....', userData);
      
      // Find user by email
      const user = await User.findOne({ email: userData.email });
      
      if (!user) {
        return {
          success: false
        };
      }
      
      // Update password if provided
      if (userData.newPassword) {
        user.password = userData.newPassword;
        await user.save();
      }
      
      return {
        success: true
      };
      
    } catch (error) {
      console.error("Error in forget password repo:", error);
      throw error;
    }
  };


  Changing_the__newPassWord = async (userData: {
    email: string;
    newPassword?: string;
}): Promise<UserResponse> => {
    try {
        console.log('Repository function called with:', userData);
        
        // Find user by email
        const user = await User.findOne({ email: userData.email });
        
        if (!user) {
            return {
                success: false
            };
        }
        
        // Update password if provided
        if (userData.newPassword) {
            user.password = userData.newPassword;
            await user.save();
        }
        
        return {
            success: true
        };
        
    } catch (error) {
        console.error("Error in change password repository:", error);
        throw error;
    }
}

}
