
import { DoctorApplicationResponse, DoctorFormData, StatusUpdateResponse } from "../../allTypes/types";
  
  export interface IapplyDoctorService {
    
    apply_For_doctor(doctorData: DoctorFormData): Promise<DoctorApplicationResponse>;

    UpdateDctorStatus__AfterAdminApprove(email: string): Promise<StatusUpdateResponse>;
  }