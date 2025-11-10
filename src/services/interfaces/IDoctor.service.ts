import { UserResponse } from '@/entities/user_interface';
import {
    ApplyDoctorRequest,
    ApplyDoctorResponse,
    DoctorApplicationResponse,
    DoctorFormData,
    RepositoryDoctorsResponse,
    RepositorySingleDoctorResponsee,
    SearchDoctorResponse,
    StatusUpdateResponse,
} from '@/types';

export interface IDoctorService {
    searchDoctors(
        searchQuery?: string,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        page?: number,
        limit?: number,
        role?: string
    ): Promise<SearchDoctorResponse>;

    applyForDoctor(
        doctorData: DoctorFormData,
        requestData: ApplyDoctorRequest
    ): Promise<ApplyDoctorResponse>;
    updateDoctorStatusAfterAdminApproval(
        email: string
    ): Promise<StatusUpdateResponse>;

    blockDoctor(email: string): Promise<boolean>;

    getAllDoctors(): Promise<RepositoryDoctorsResponse>;
    getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
    deleteDoctorAfterRejection(email: string): Promise<UserResponse>;
    
}
