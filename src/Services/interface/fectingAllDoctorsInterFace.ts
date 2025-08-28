import { RepositoryDoctorsResponse, RepositorySingleDoctorResponse, RepositorySingleDoctorResponsee } from "../../allTypes/types";

export interface IDoctorService  {
    getAllDoctors(): Promise<RepositoryDoctorsResponse>;
    getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
}