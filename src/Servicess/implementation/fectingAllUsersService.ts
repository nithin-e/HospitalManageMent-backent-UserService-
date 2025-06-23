import { IfectingAllUsersService } from "../interface/fectingAllUsersServiceInterFace";
import FetchAllDataRepository from "../../repositoriess/implementation/fectingAllUsersRepo"


interface SearchParams {
  searchQuery: string;
  sortBy: string;
  sortDirection: string;
  role: string;
  page: number;
  limit: number;
}


export default class fetchDataService  implements IfectingAllUsersService{
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




searchUserDebounce = async (params: SearchParams) => {
  try {
    const response = await this.fetchAllDataRepo.searchUserDebounce(params);
    return {
      users: response.users,
      totalCount: response.totalCount,
      activeCount: response.activeCount,
      blockedCount: response.blockedCount,
      success: true,
      message: 'Search completed'
    };
  } catch (error) {
    console.error("Error in debounced search service:", error);
    throw error;
  }
};



}