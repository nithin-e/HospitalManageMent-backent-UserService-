import {
  RepositoryDoctorsResponse,
  RepositorySingleDoctorResponsee,
} from "../../interfaces/types";

export interface IDoctorService {
  getAllDoctors(): Promise<RepositoryDoctorsResponse>;
  getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
}
