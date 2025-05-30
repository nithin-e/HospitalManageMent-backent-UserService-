import { DoctorDb } from "../../entities/doctor_schema";
import {User} from '../../entities/user_schema'
import { IapplyDoctorRepository } from "../interface/applyDoctorRepoInterFace";




export default class ApplyDoctorRepository implements IapplyDoctorRepository{
  apply_For_doctorRepo = async (doctorData: any): Promise<any> => {
    try {

      console.log('inside the repo1', doctorData);
      if (!doctorData.email || doctorData.email === '') {
        return {
          success: false,
          message: "Please use your logged-in email address for the application.",
          doctor: {}
        };
      }
  
      // Check if an account with this email already exists
      const existingDoctor = await DoctorDb.findOne({ email: doctorData.email });
      
      // Find the user by ID to verify email
      const currentUser = await User.findById(doctorData.userId);
      
      // Check if doctor already exists
      if (existingDoctor) {
        return { 
          success: false, 
          message: "You have already applied. Please wait for a response.",
          doctor: {}
        };
      }
      
      // Verify that the doctor is using the same email as their user account
      if (!currentUser || currentUser.email !== doctorData.email) {
        return {
          success: false,
          message: "Please use your logged-in email address for the application.",
          doctor: {}
        };
      }
  
      console.log('inside the repo', doctorData);
  
      // Create a new doctor instance
      const newDoctor = new DoctorDb({
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        email: doctorData.email,
        phoneNumber: doctorData.phoneNumber,
        licenseNumber: doctorData.licenseNumber,
        specialty: doctorData.specialty,
        qualifications: doctorData.qualifications,
        medicalLicenseNumber: doctorData.medicalLicenseNumber,
        profileImageUrl: doctorData.profileImageUrl,
        medicalLicenseUrl: doctorData.medicalLicenseUrl,
        agreeTerms: doctorData.agreeTerms,
        status: 'pending',
        userId: doctorData.userId  // Link doctor to user account
      });
  
      // Save the doctor to the database
      const savedDoctor = await newDoctor.save();
      console.log('Doctor saved successfully:', savedDoctor._id);
  
      // Return the saved doctor data
      return {
        success: true,
        message: "Application submitted successfully. We'll review your details soon.",
        doctor: {
          id: savedDoctor._id,
          firstName: savedDoctor.firstName,
          lastName: savedDoctor.lastName,
          email: savedDoctor.email,
          phoneNumber: savedDoctor.phoneNumber,
          specialty: savedDoctor.specialty,
          status: savedDoctor.status,
          profileImageUrl: savedDoctor.profileImageUrl,
          medicalLicenseUrl: savedDoctor.medicalLicenseUrl,
        },
      };
    } catch (error) {
      console.error('Error saving doctor:', error);
  
      // Handle duplicate email error from MongoDB
      if ((error as any).code === 11000) {
        return {
          success: false,
          message: 'Email already exists',
          doctor: {}
        };
      }
  
      // Return a generic error message instead of re-throwing
      return {
        success: false,
        message: 'An error occurred while processing your application. Please try again later.',
        doctor: {}
      };
    }
  };



  UpdateDctorStatus__AfterAdminApprove__doctorRepo = async (email: string): Promise<any> => {
    try {
      console.log('inside the repo', email);
      
      // Find the doctor by email and update the status
      const updatedDoctor = await DoctorDb.findOneAndUpdate(
        { email: email },
        { status: "proccesing" },  // Change status from "pending" to "approved"
        { new: true }  // Return the updated document
      );
      
      if (!updatedDoctor) {
        return {
          success: false,
          
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error updating doctor status:', error);
      
      // Handle duplicate email error from MongoDB
      if ((error as any).code === 11000) {
        return {
          success: false,
          message: 'Email already exists',
          doctor: {}
        };
      }
      
      // Handle other errors
      return {
        success: false,
        message: 'Failed to update doctor status',
        error: (error as Error).message
      };
    }
  }

}