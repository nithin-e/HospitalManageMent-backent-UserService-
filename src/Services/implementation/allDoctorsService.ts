import { IDoctorService } from "../interface/IAllDoctorsService";
import { RepositoryDoctorsResponse, RepositorySingleDoctorResponsee } from "../../interfaces/types";
import { mapDoctorToDTO } from "../../dto/doctor.mapper";
import { IDoctorRepository } from "../../repositories/interface/IAllDoctorsRepository";

export default class FetchDataUseCase implements IDoctorService {
  private readonly _doctorRepo: IDoctorRepository;

  constructor(doctorRepo: IDoctorRepository) {
    this._doctorRepo = doctorRepo;
  }

    getAllDoctors = async (): Promise<RepositoryDoctorsResponse> => {
        try {
            const response = await this._doctorRepo.getAllDoctors();

      
            const doctorDtos = response.data.map(mapDoctorToDTO);
            return {
                ...response,
                data:doctorDtos
            }
          
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error;
        }
    }



    getDoctorByEmail = async (email: string): Promise<RepositorySingleDoctorResponsee> => {
        try {
          
            const response = await this._doctorRepo.getDoctorByEmail(email);
            console.log('check this responce while fecting onedoctor', response);

            const doctorDtos = response.doctor?mapDoctorToDTO(response.doctor):null;
            return {
               ...response,
                doctor:doctorDtos
            }
           
        } catch (error) {
            console.error("Error in doctor fetch use case:", error);
            throw error;
        }
    };
}