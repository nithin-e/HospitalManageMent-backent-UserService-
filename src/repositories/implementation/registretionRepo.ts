
import { registration, UserResponse } from "../../entities/user_interface";
import {User} from '../../entities/user_schema'
import { IRegistrationRepository } from "../interface/registretionRepoInterFace";

export default class UserRepository  implements IRegistrationRepository{
    saveUser = async (userData: registration): Promise<UserResponse> => {
        
        
        try {
           
            
            
            const userCount = await User.countDocuments();
            
  
            const existingUser = await User.findOne({ email: userData.email });
            
            // If user exists and this is a Google login (has googleId)
            if (existingUser && userData.google_id) {
                console.log("Existing user found for Google sign-in:", existingUser);
                
                // Update googleId if not present in existing user
                if (!existingUser.googleId) {
                    existingUser.googleId = userData.google_id;
                    const updatedUser = await existingUser.save();
                    console.log("Updated existing user with Google ID:", updatedUser);
                    return updatedUser as UserResponse;
                }
             
                return existingUser as UserResponse;
            }
            
            // For regular sign up, reject if email exists
            if (!userData.google_id && existingUser) {
                const error = new Error(`User with email ${userData.email} already exists`);
                error.name = 'DuplicateEmailError';
                throw error;
            }
            
            // Create new user if no existing user found
            const newUser = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password || '', // Password might be empty for Google sign up
                phoneNumber: userData.phone_number || '',
                googleId: userData.google_id || '',
                role: userCount === 0 ? 'admin' : 'user' 
            });
    
            const savedUser = await newUser.save();
            console.log("User saved into DB:", savedUser);
            
            return savedUser as UserResponse;
        } catch (error) {
            console.error("Error saving user:", error);
            
            // Handle MongoDB duplicate key error
            if (error instanceof Error && 
                ((error.name === 'MongoServerError' && 'code' in error && (error as any).code === 11000) ||
                 error.name === 'DuplicateEmailError')) {
                
                if (userData.google_id || userData.google_id) {
                    try {
                        const existingUser = await User.findOne({ email: userData.email });
                        if (existingUser) {
                            console.log("Returning existing user for Google sign-in:", existingUser);
                            return existingUser as UserResponse;
                        }
                    } catch (findError) {
                        console.error("Error finding existing user:", findError);
                    }
                }
                
                // Regular registration duplicate email
                const duplicateError = new Error(`User with email ${userData.email} already exists`);
                duplicateError.name = 'DuplicateEmailError';
                throw duplicateError;
            }
            
            // Re-throw other errors
            throw new Error((error as Error).message);
        }
    };


    checkUser = async (email: string, phoneNumber: string): Promise<UserResponse> => {
        try {
            const CheckingUser = await User.findOne({ email })
            console.log("userDetailWithEmail", CheckingUser)
            
            if (CheckingUser) {
                return { success: false, message: 'user already registered with this email' };
            }
            
            console.log('inside the repo with no user')
           
            return { success: true, message: 'user not registered' };
            
        } catch (error) {
            console.log('..error aahnu mone...', error);
            throw new Error('Error checking user registration')
        }
    }
}