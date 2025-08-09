import { IfectingAllUsersService } from "../interface/fectingAllUsersServiceInterFace";
import FetchAllDataRepository from "../../repositoriess/implementation/fectingAllUsersRepo"
import { mapUserToDTO, UserDTO } from "../../dto/user.dto";
import { IfectingAllUsersRepository } from "../../repositoriess/interface/fectingAllUsersRepoInterFace";



export interface SearchParams {
  searchQuery: string; 
  sortBy: string;
  sortDirection: any;
  role:any;
  page: number;
  limit: number;
}


export default class fetchDataService  implements IfectingAllUsersService{
    private fetchAllDataRepo:IfectingAllUsersRepository;
constructor(fetchAllDataRepo:IfectingAllUsersRepository){
     this.fetchAllDataRepo=fetchAllDataRepo;
}

fecting_Data=async (): Promise<UserDTO[]>=>{
    try {
     const response= await this.fetchAllDataRepo.fetchingAllUserData()
     const userDTOs = response.data.map(mapUserToDTO);
      return userDTOs;

    } catch (error) {
        console.error("Error in login use case:", error);
        throw error
    }
}


fecting_SingleUser = async (email: string):Promise<UserDTO> => {
    try {
      const response = await this.fetchAllDataRepo.fetching_a__SingleUser(email);
      const userDTO = mapUserToDTO(response);
    return userDTO;
    } catch (error) {
      console.error("Error in fetching single user use case:", error);
      throw error;
    }
}

// fecthingUserDetails__ThroughSocket
fecthingUserDetails__ThroughSocket = async (patientId: string) => {
  try {
   
    const response = await this.fetchAllDataRepo.fecthing_UserDetails__ThroughSocket(patientId);
    
    if (!response) {
      throw new Error(`User not found with ID: ${patientId}`);
    }
    
  
    return response;
  } catch (error) {
    console.error("Error in fetching user details service:", error);
    throw error;
  }
}




searchUserDebounce = async (
  searchQuery: string = '',
  sortBy: string = 'createdAt',
  sortDirection: string = 'desc',
  role: string = '',
  page: number = 1,
  limit: number = 50
) => {
  try {
    const params: SearchParams = {
      searchQuery: searchQuery || '', 
      sortBy: sortBy || 'createdAt',
      sortDirection: sortDirection || 'desc',
      role: role || '',
      page: page || 1,
      limit: limit || 50
    };

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
}



}