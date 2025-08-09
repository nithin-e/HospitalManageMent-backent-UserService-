import { RepositoryDoctorsResponse, RepositorySingleDoctorResponse, RepositorySingleDoctorResponsee } from "../../allTypes/types";

export interface IfectingAllDoctorsService {
    fectingDoctor_Data(): Promise<RepositoryDoctorsResponse>;
    fetchSingleDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
}