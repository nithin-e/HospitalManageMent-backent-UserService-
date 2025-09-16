import {User} from '../../entities/user_schema'
import {  IUserRepository, SearchUserResponse } from '../interface/fectingAllUsersRepoInterFace';
import type { User as UserType } from "../../entities/user_schema";
import  { DoctorDb} from "../../entities/doctor_schema";
import { BaseRepository } from './baseRepo';



// types/doctorTypes.ts
export interface DoctorDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  medicalLicenseNumber: string;
  specialty: string;
  qualifications: string;
  agreeTerms: boolean;
  profileImageUrl: string;
  medicalLicenseUrl: string;
  status: string;
  isActive: boolean;
  createdAt: string; 
}


export interface SearchDoctorResponse {
  doctors: DoctorDTO[];
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  declinedCount: number;
  success?: boolean;
  message?: string;
}



export interface RepositoryUsersResponse {
  success?: boolean;
  data: User[];
  message?: string;
}

interface SearchParams {
  searchQuery: string;
  sortBy: string;
  sortDirection: string;
  role: string;
  page: number;
  limit: number;
  status?: ''
}



export interface SearchParamss {
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  role: string; 
  page: number;
  limit: number;
}





export default class FetchAllDataRepository  extends BaseRepository<UserType> implements IUserRepository{
    
  
  constructor() {
      super(User); 
    }


  async getAllUsers() : Promise<RepositoryUsersResponse>{
    try {
      const users = await this.find({});
      return {
        data: users
      };
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

    getUserByEmail = async (email: string):Promise<User> => {
      try {
        console.log('Fetching user with email in repo:', email);
        
     
        const user = await this.findOne({email });
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Return the user data
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
  }

  
  



  async searchUsers(params: SearchParams): Promise<SearchUserResponse> {
  try {
    const { searchQuery, sortBy, sortDirection, role, page, limit } = params;
    const query: Record<string, unknown> = {};
    
    if (searchQuery && searchQuery.trim()) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (role && role.trim()) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const sortObj: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortObj[sortBy] = sortDirection === 'asc' ? 1 : -1;
    }

    // Include phoneNumber in the select to ensure it's available for mapping
    const [users, totalCount, activeCount, blockedCount] = await Promise.all([
      User.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('_id name email phoneNumber role isActive createdAt')
        .lean(),
      User.countDocuments(query),
      User.countDocuments({ ...query, isActive: true }),
      User.countDocuments({ ...query, isActive: false })
    ]);

    // Map to strict UserDTO format
    const mappedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phoneNumber || '', 
      role: user.role || 'user',
      isActive: user.isActive ?? false,
      createdAt: user.createdAt ? user.createdAt.toISOString() : ''
    }));

    return {
      users: mappedUsers,
      totalCount,
      activeCount,
      blockedCount
    };

  } catch (error) {
    console.error("Error in debounced search repository:", error);
    throw error;
  }
}


  getUserDetailsViaSocket = async (patientId: string) => {
    try {
      console.log('Repository: Fetching user with ID:', patientId);
      
     
      const user = await User.findById(patientId).select('-password');
      
      if (!user) {
        throw new Error(`User not found with ID: ${patientId}`);
      }
      
      console.log('Repository: User found:', user);
      return user;
      
    } catch (error) {
      console.error("Error fetching user from database:", error);
      throw error;
    }
}
  

  
async searchDoctors(params: SearchParamss) : Promise<SearchDoctorResponse> {
 try {
    console.log('Search doctors params:', params);

    const { searchQuery, sortBy, sortDirection, page, limit } = params;
    const query: Record<string, unknown> = {};
    
    // Search query logic
    if (searchQuery && searchQuery.trim()) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { specialty: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const sortObj: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortObj[sortBy] = sortDirection === 'asc' ? 1 : -1;
    } else {
      // Default sort by createdAt descending
      sortObj.createdAt = -1;
    }

    // Execute all queries in parallel
    const [doctors, totalCount, approvedCount, pendingCount, declinedCount] = await Promise.all([
      DoctorDb.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('_id firstName lastName email phoneNumber licenseNumber medicalLicenseNumber specialty qualifications agreeTerms profileImageUrl medicalLicenseUrl status isActive createdAt')
        .lean(),
      DoctorDb.countDocuments(query),
      DoctorDb.countDocuments({ ...query, status: 'approved' }),
      DoctorDb.countDocuments({ ...query, status: 'pending' }),
      DoctorDb.countDocuments({ ...query, status: 'declined' })
    ]);

    // Map to strict DoctorDTO format - INCLUDING createdAt
    const mappedDoctors = doctors.map(doctor => ({
      id: doctor._id.toString(),
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      email: doctor.email || '',
      phoneNumber: doctor.phoneNumber || '',
      licenseNumber: doctor.licenseNumber || '',
      medicalLicenseNumber: doctor.medicalLicenseNumber || '',
      specialty: doctor.specialty || '',
      qualifications: doctor.qualifications || '',
      agreeTerms: doctor.agreeTerms || false,
      profileImageUrl: doctor.profileImageUrl || '',
      medicalLicenseUrl: doctor.medicalLicenseUrl || '',
      status: doctor.status || 'pending',
      isActive: doctor.isActive ?? true,
      createdAt: doctor.createdAt ? doctor.createdAt : new Date().toISOString()
    }));

    return {
      doctors: mappedDoctors,
      totalCount,
      approvedCount,
      pendingCount,
      declinedCount,
      success: true
    };

  } catch (error) {
    console.error("Error in search doctors repository:", error);
    throw error;
  }
}


  }