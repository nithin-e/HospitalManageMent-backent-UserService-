import { DoctorFormData } from "../../entities/user_interface";
import ApplyDoctorRepository from "../../repositoriess/implementation/applyDoctorRepo";
import bcrypt from "../../services/bcrypt";
import { IapplyDoctorService } from "../interface/applyDoctorServicesInterface";



export default class ApplyDoctorService  implements IapplyDoctorService {

    private applyDoctorRepo: ApplyDoctorRepository;
    
    constructor(applyDoctorRepo: ApplyDoctorRepository) {
      this.applyDoctorRepo= applyDoctorRepo
    }
    
    apply_For_doctor = async (doctorData: DoctorFormData): Promise<any> => {
      try {
        // Destructure with camelCase keys
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
    
        // Create doctor data with all required fields
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
    
        // console.log('inside the use case', newDoctorData);
    
        const response = await this.applyDoctorRepo.apply_For_doctorRepo(newDoctorData);
    
        return response;
      } catch (error) {
        console.log('Error in use case:', error);
        throw error;
      }
    }


    UpdateDctorStatus__AfterAdminApprove= async (email:any): Promise<any> => {
      try {
        // Destructure with camelCase keys
       
    
       
    
    
        // console.log('inside the use case', email);
    
        const response = await this.applyDoctorRepo.UpdateDctorStatus__AfterAdminApprove__doctorRepo(email);
    
        return response;
      } catch (error) {
        console.log('Error in use case:', error);
        throw error;
      }
    }

}