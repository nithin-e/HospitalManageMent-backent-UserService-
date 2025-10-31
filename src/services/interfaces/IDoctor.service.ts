import {
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
        doctorData: DoctorFormData
    ): Promise<DoctorApplicationResponse>;
    updateDoctorStatusAfterAdminApproval(
        email: string
    ): Promise<StatusUpdateResponse>;

    blockDoctor(email: string): Promise<boolean>;

    getAllDoctors(): Promise<RepositoryDoctorsResponse>;
    getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
}
