import {
  SearchDoctorResponse,
  SearchParams,
  SearchParamss,
} from "../../interfaces/types";
import { UserDTO } from "../../dto/user.dto";
import { User } from "../../entities/user_schema";
import { RepositoryUsersResponse } from "../implementation/allUserRepository";

export interface SearchUserResponse {
  users: UserDTO[];
  totalCount: number;
  activeCount: number;
  blockedCount: number;
  success?: boolean;
  message?: string;
}

export interface IUserRepository {
  getAllUsers(): Promise<RepositoryUsersResponse>;

  getUserByEmail(email: string): Promise<User>;

  searchUsers(params: SearchParams): Promise<SearchUserResponse>;

  getUserDetailsViaSocket(patientId: string): Promise<User>;

  searchDoctors(params: SearchParamss): Promise<SearchDoctorResponse>;
}
