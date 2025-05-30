
import { registration, UserResponse } from "../../entities/user_interface";
import {User} from '../../entities/user_schema'
import { IRegistretionInterFaceRepo } from "../interface/registretionRepoInterFace";

export default class userRepository implements IRegistretionInterFaceRepo{
    saveUser = async (userData: registration): Promise<UserResponse> => {
        console.log('..inside the repo...', userData);
        
        try {
           
            
            // Check if this is the first user by counting existing users
            const userCount = await User.countDocuments();
            
            // Check if user with this email already exists
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
                
                // User already has GoogleId, just return the existing user
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
                
                // If Google sign-in, we should have handled this above, so this is unexpected
                if (userData.google_id || userData.google_id) {
                    // Try to find and return the user instead of throwing an error
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


    checkUser=async (email:string,phoneNumber:any)=>{
     try {
        const CheckingUser = await User.findOne({ email })
        console.log("userDetailWithEmail", CheckingUser)
        if (CheckingUser) {
            return CheckingUser;
          }
        
     } catch (error) {
        console.log('..error aahnu mone...',error);
        
        return (error as Error).message;
     }
    }
}