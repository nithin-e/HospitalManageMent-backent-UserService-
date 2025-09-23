import {
  DoctorApplicationResponse,
  DoctorFormData,
  StatusUpdateResponse,
} from "../../interfaces/types";

export interface IDoctorService {
  applyForDoctor(
    doctorData: DoctorFormData
  ): Promise<DoctorApplicationResponse>;
  updateDoctorStatusAfterAdminApproval(
    email: string
  ): Promise<StatusUpdateResponse>;
}
