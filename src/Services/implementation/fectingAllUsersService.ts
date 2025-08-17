import {  IUserService } from "../interface/fectingAllUsersServiceInterFace";
import FetchAllDataRepository from "../../repositories/implementation/fectingAllUsersRepo"
import { mapUserToDTO, UserDTO } from "../../dto/user.dto";
import {  IUserRepository } from "../../repositories/interface/fectingAllUsersRepoInterFace";



export interface SearchParams {
  searchQuery: string; 
  sortBy: string;
  sortDirection: any;
  role:any;
  page: number;
  limit: number;
}


export default class fetchDataService  implements IUserService{
    private fetchAllDataRepo:IUserRepository;
constructor(fetchAllDataRepo:IUserRepository){
     this.fetchAllDataRepo=fetchAllDataRepo;
}

getAllUsers=async (): Promise<UserDTO[]>=>{
    try {
     const response= await this.fetchAllDataRepo.getAllUsers()
     const userDTOs = response.data.map(mapUserToDTO);
      return userDTOs;

    } catch (error) {
        console.error("Error in login use case:", error);
        throw error
    }
}


getUserByEmail = async (email: string):Promise<UserDTO> => {
    try {
      const response = await this.fetchAllDataRepo.getUserByEmail(email);
      const userDTO = mapUserToDTO(response);
    return userDTO;
    } catch (error) {
      console.error("Error in fetching single user use case:", error);
      throw error;
    }
}

// fecthingUserDetails__ThroughSocket
getUserDetailsViaSocket = async (patientId: string): Promise<UserDTO> => {
  try {
    const user = await this.fetchAllDataRepo.getUserDetailsViaSocket(patientId);
    
    if (!user) {
      throw new Error(`User not found with ID: ${patientId}`);
    }
    
    // Map the User document to UserDTO
    return mapUserToDTO(user);
  } catch (error) {
    console.error("Error in fetching user details service:", error);
    throw error;
  }
}




searchUsers = async (
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

    const response = await this.fetchAllDataRepo.searchUsers(params);
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