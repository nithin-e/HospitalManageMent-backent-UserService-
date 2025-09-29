import { DoctorFormData, DoctorApplicationResponse, StatusUpdateResponse } from "@/types";

export interface IApplyDoctorService {
    applyForDoctor(
        doctorData: DoctorFormData
    ): Promise<DoctorApplicationResponse>;
    updateDoctorStatusAfterAdminApproval(
        email: string
    ): Promise<StatusUpdateResponse>;

    blockDoctor(email: string): Promise<boolean>;
}
