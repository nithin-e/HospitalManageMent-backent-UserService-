import { StatusUpdateResponse } from "src/entities/user_interface";
import { DoctorApplicationResult, DoctorFormData } from "../../interfaces/types";
import { DoctorDb } from "../../entities/doctor_schema";
import { User } from "../../entities/user_schema";
import {
  IDoctorRepository,
  
} from "../interface/IDoctorRepository";

export default class ApplyDoctorRepository implements IDoctorRepository {
  applyForDoctor = async (
    doctorData: DoctorFormData
  ): Promise<DoctorApplicationResult> => {
    try {
      console.log("inside the repo1", doctorData);

      if (!doctorData.email || doctorData.email === "") {
        return {
          success: false,
          message:
            "Please use your logged-in email address for the application.",
        };
      }

      const existingDoctor = await DoctorDb.findOne({
        email: doctorData.email,
      });
      const currentUser = await User.findById(doctorData.userId);

      if (existingDoctor) {
        return {
          success: false,
          message: "You have already applied. Please wait for a response.",
          // No doctor property since it's optional
        };
      }

      if (!currentUser || currentUser.email !== doctorData.email) {
        return {
          success: false,
          message:
            "Please use your logged-in email address for the application.",
          // No doctor property since it's optional
        };
      }

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
        status: "pending",
        userId: doctorData.userId,
      });

      const savedDoctor = await newDoctor.save();
      console.log("Doctor saved successfully:", savedDoctor._id);

      return {
        success: true,
        message:
          "Application submitted successfully. We'll review your details soon.",
        doctor: {
          id: savedDoctor._id.toString(),
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
      console.error("Error saving doctor:", error);

      return {
        success: false,
        message:
          "An error occurred while processing your application. Please try again later.",
        // No doctor property since it's optional
      };
    }
  };

  updateDoctorStatusAfterAdminApproval = async (
    email: string
  ): Promise<StatusUpdateResponse> => {
    try {
      const updatedDoctor = await DoctorDb.findOneAndUpdate(
        { email: email },
        { status: "proccesing" },
        { new: true }
      );

      console.log("plase check this response in repo", updatedDoctor);

      if (!updatedDoctor) {
        return {
          success: false,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error updating doctor status:", error);

      return {
        success: false,
        message: "Failed to update doctor status",
        error: (error as Error).message,
      };
    }
  };
}
