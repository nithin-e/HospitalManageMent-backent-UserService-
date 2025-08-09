import { IfectingAllDoctorsService } from "../interface/fectingAllDoctorsInterFace";
import FetchAllDoctorRepository from "../../repositoriess/implementation/fectingAllDoctorsRepo";
import { RepositoryDoctorsResponse, RepositorySingleDoctorResponse, RepositorySingleDoctorResponsee } from "../../allTypes/types";
import { mapDoctorToDTO } from "../../dto/doctor.mapper";
import { IfectingAllDoctorsInterFace } from "../../repositoriess/interface/fectingAllDoctorsInterFace";

export default class FetchDataUseCase implements IfectingAllDoctorsService {
    private readonly fetchAllDoctorRepo: IfectingAllDoctorsInterFace;

    constructor(fetchAllDoctorRepo: IfectingAllDoctorsInterFace) {
        this.fetchAllDoctorRepo = fetchAllDoctorRepo;
    }

    fectingDoctor_Data = async (): Promise<RepositoryDoctorsResponse> => {
        try {
            const response = await this.fetchAllDoctorRepo.fetchingAllDoctorData();

      
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



    fetchSingleDoctorByEmail = async (email: string): Promise<RepositorySingleDoctorResponsee> => {
        try {
          
            const response = await this.fetchAllDoctorRepo.fetchSingleDoctorByEmail(email);
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