

import { UserDTO } from "../../dto/user.dto";
import { SearchDoctorResponse } from "../../repositories/implementation/fectingAllUsersRepo";
import { SearchUserResponse } from "../../repositories/interface/fectingAllUsersRepoInterFace";


export interface IUserService {
  getAllUsers(): Promise<UserDTO[]>;

  getUserByEmail(email: string): Promise<UserDTO>;

  searchUsers(
    searchQuery?: string,
    sortBy?: string,
    sortDirection?: "asc" | "desc",
    role?: string,
    page?: number,
    limit?: number
  ): Promise<SearchUserResponse>;

  getUserDetailsViaSocket(patientId: string): Promise<UserDTO>;

  searchDoctors(
    searchQuery?: string,
    sortBy?: string,
    sortDirection?: "asc" | "desc",
    page?: number,
    limit?: number,
    role?:string
  ): Promise<SearchDoctorResponse>;

  
}