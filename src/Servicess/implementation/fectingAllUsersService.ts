import { IfectingAllUsersService } from "../interface/fectingAllUsersServiceInterFace";
import FetchAllDataRepository from "../../repositoriess/implementation/fectingAllUsersRepo"


export default class fetchDataUseCase  implements IfectingAllUsersService{
    private fetchAllDataRepo:FetchAllDataRepository;
constructor(fetchAllDataRepo:FetchAllDataRepository){
     this.fetchAllDataRepo=fetchAllDataRepo;
}

fecting_Data=async ()=>{
    try {
     const response= await this.fetchAllDataRepo.fetchingAllUserData()
     return response;

    } catch (error) {
        console.error("Error in login use case:", error);
        throw error
    }
}


fecting_SingleUser = async (email: string) => {
    try {
      const response = await this.fetchAllDataRepo.fetching_a__SingleUser(email);
      return response;
    } catch (error) {
      console.error("Error in fetching single user use case:", error);
      throw error;
    }
}

}