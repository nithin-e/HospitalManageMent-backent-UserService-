import { StatusUpdateResponse, UserResponse } from '@/entities/user_interface';
import {
    RepositoryDoctorsResponse,
    RepositorySingleDoctorResponsee,
    Searchparams,
    SearchDoctorResponse,
    DoctorFormData,
} from '@/types';
import { DoctorApplicationResponse } from '@/types/doctor.types';

export interface IDoctorRepository {
    getAllDoctors(): Promise<RepositoryDoctorsResponse>;
    getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
    searchDoctors(params: Searchparams): Promise<SearchDoctorResponse>;
    applyForDoctor(
        doctorData: DoctorFormData
    ): Promise<DoctorApplicationResponse>;
    updateDoctorStatusAfterAdminApproval(
        email: string
    ): Promise<StatusUpdateResponse>;
    blockDoctor(email: string): Promise<boolean>;
    deleteDoctorAfterAdminReject(email: string): Promise<UserResponse>;
}
