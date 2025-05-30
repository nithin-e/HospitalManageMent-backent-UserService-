import { IfectingAllDoctorsService } from "../interface/fectingAllDoctorsInterFace";
import FetchAllDoctorRepository from "../../repositoriess/implementation/fectingAllDoctorsRepo"


export default class fetchDataUseCase implements IfectingAllDoctorsService{
    private fetchAllDoctorRepo:FetchAllDoctorRepository;
constructor(fetchAllDoctorRepo:FetchAllDoctorRepository){
     this.fetchAllDoctorRepo=fetchAllDoctorRepo;
}

fectingDoctor_Data=async ()=>{
    try {
     const response= await this.fetchAllDoctorRepo.fetchingAllDoctorData()
     return response;

    } catch (error) {
        console.error("Error in login use case:", error);
        throw error
    }
}

fetchSingleDoctorByEmail = async (email: string) => {
    try {

        console.log('usecase before res',email);
      const response = await this.fetchAllDoctorRepo.fetchSingleDoctorByEmail(email);
      return response;
    } catch (error) {
      console.error("Error in doctor fetch use case:", error);
      throw error;
    }
  };

}