import {  StatusUpdateResponse } from "../../allTypes/types";
import { DoctorFormData,DoctorApplicationResponse } from "../../allTypes/types";
import {  IDoctorRepository } from "../../repositories/interface/applyDoctorRepoInterFace";
import {  IDoctorService } from "../interface/applyDoctorServicesInterface";



export default class ApplyDoctorService  implements IDoctorService {

  private readonly _applyDoctorRepo: IDoctorRepository;

  constructor(applyDoctorRepo: IDoctorRepository) {
    this._applyDoctorRepo = applyDoctorRepo;
  }
    
    applyForDoctor = async (doctorData:DoctorFormData ): Promise<DoctorApplicationResponse> => {
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
    
        if (!firstName || !lastName || !email || !specialty || !agreeTerms) {
          throw new Error('Missing required fields');
        }

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
    

        const response = await this._applyDoctorRepo.applyForDoctor(newDoctorData);

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


    updateDoctorStatusAfterAdminApproval= async (email:string): Promise<StatusUpdateResponse> => {
      try {
      
      
        const response = await this._applyDoctorRepo.updateDoctorStatusAfterAdminApproval(email);
    
        return response;
      } catch (error) {
        console.log('Error in use case:', error);
        throw error;
      }
    }




    

}