import { StatusUpdateResponse } from 'src/entities/user_interface';
import { DoctorFormData } from '../../interfaces/types';

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

export interface IApplyDoctorRepository {
    applyForDoctor(
        doctorData: DoctorFormData
    ): Promise<DoctorApplicationResponse>;
    updateDoctorStatusAfterAdminApproval(
        email: string
    ): Promise<StatusUpdateResponse>;
    blockDoctor(email: string): Promise<boolean>;
}
