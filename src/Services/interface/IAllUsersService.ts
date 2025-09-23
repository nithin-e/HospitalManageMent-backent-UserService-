import { SearchDoctorResponse } from "src/interfaces/types";
import { UserDTO } from "../../dto/user.dto";
import { SearchUserResponse } from "../../repositories/interface/IAllUsersRepository";

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
    role?: string
  ): Promise<SearchDoctorResponse>;
}
