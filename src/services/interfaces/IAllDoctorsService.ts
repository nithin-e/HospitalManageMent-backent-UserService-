import { RepositoryDoctorsResponse, RepositorySingleDoctorResponsee } from "@/types";

export interface IFetchDoctorService {
    getAllDoctors(): Promise<RepositoryDoctorsResponse>;
    getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
}
