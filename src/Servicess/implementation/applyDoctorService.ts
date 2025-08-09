import {  StatusUpdateResponse } from "../../allTypes/types";
import { DoctorFormData,DoctorApplicationResponse } from "../../allTypes/types";
import ApplyDoctorRepository from "../../repositoriess/implementation/applyDoctorRepo";
import { IapplyDoctorRepository } from "../../repositoriess/interface/applyDoctorRepoInterFace";
import bcrypt from "../../services/bcrypt";
import { IapplyDoctorService } from "../interface/applyDoctorServicesInterface";



export default class ApplyDoctorService  implements IapplyDoctorService {

    private applyDoctorRepo: IapplyDoctorRepository;
    
    constructor(applyDoctorRepo: IapplyDoctorRepository) {
      this.applyDoctorRepo= applyDoctorRepo
    }
    
    apply_For_doctor = async (doctorData:DoctorFormData ): Promise<DoctorApplicationResponse> => {
      try {
     
        const {
          userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          licenseNumber,
          specialty,
          qualifications,
          medicalLicenseNumber,
          agreeTerms,
          documentUrls,
        } = doctorData;
    
        // Validate required fields
        if (!firstName || !lastName || !email || !specialty || !agreeTerms) {
          throw new Error('Missing required fields');
        }
    
        // Assign image URLs from documentUrls
        const profileImageUrl = documentUrls && documentUrls.length > 0 ? documentUrls[0] : null;
        const medicalLicenseUrl = documentUrls && documentUrls.length > 1 ? documentUrls[1] : null;
    
        
        const newDoctorData = {
          userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          licenseNumber,
          specialty,
          qualifications,
          medicalLicenseNumber,
          profileImageUrl,
          medicalLicenseUrl,
          agreeTerms: typeof agreeTerms === 'string' ? agreeTerms === 'true' : !!agreeTerms,
        };
    

        const response = await this.applyDoctorRepo.apply_For_doctorRepo(newDoctorData);
    
    

        if (response.success && response.doctor) {
          return {
            id: response.doctor.id,
            firstName: response.doctor.firstName,
            lastName: response.doctor.lastName,
            email: response.doctor.email,
            status: response.doctor.status,
            message: response.message,
          };
        } else {
         
          throw new Error(response.message || 'Doctor application failed');
        }
      } catch (error) {
        console.log('Error in use case:', error);
        throw error;
      }
    }


    UpdateDctorStatus__AfterAdminApprove= async (email:string): Promise<StatusUpdateResponse> => {
      try {
      
      
        const response = await this.applyDoctorRepo.UpdateDctorStatus__AfterAdminApprove__doctorRepo(email);
    
        return response;
      } catch (error) {
        console.log('Error in use case:', error);
        throw error;
      }
    }

}