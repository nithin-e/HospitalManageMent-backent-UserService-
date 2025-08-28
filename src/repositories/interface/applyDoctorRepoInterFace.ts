
import { DoctorFormData } from "../../allTypes/types";


  
  export interface DoctorApplicationResponse {
    success: boolean;
    message: string;
    doctor?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      specialty: string;
      status: string;
      profileImageUrl?: string;
      medicalLicenseUrl?: string;
    };
  }
  

  export interface StatusUpdateResponse {
    success: boolean;
    message?: string;
    error?: string;
  }
  

                             
  // export interface IapplyDoctorRepository {
  //   apply_For_doctorRepo(doctorData: DoctorFormData): Promise<DoctorApplicationResponse>;
  //   UpdateDctorStatus__AfterAdminApprove__doctorRepo(email: string): Promise<StatusUpdateResponse>;
  // }

  export interface IDoctorRepository {
  applyForDoctor(doctorData: DoctorFormData): Promise<DoctorApplicationResponse>;
  updateDoctorStatusAfterAdminApproval(email: string): Promise<StatusUpdateResponse>;
}