import { BaseRepository } from '../../../../shared/repositories/baseRepository';
import {User} from '../../entities/user_schema'
import {  IUserRepository, SearchUserResponse } from '../interface/fectingAllUsersRepoInterFace';
import type { User as UserType } from "../../entities/user_schema";





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
        
        // Query the database to get user by email
        const user = await this.findOne(email );
        
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

  
  
  // searchUserDebounce = async (params: SearchParams):Promise<SearchUserResponse> => {
  //     try {
  //       const { searchQuery, sortBy, sortDirection, role, page, limit } = params;
  //       const query: any = {};
        
        
  
       
  //       if (searchQuery && searchQuery.trim()) {
  //         query.$or = [
  //           { name: { $regex: searchQuery, $options: 'i' } },
  //           { email: { $regex: searchQuery, $options: 'i' } }
  //         ];
  //       }
  
  //       // Add role filter
  //       if (role && role.trim()) {
  //         query.role = role;
  //       }
  
        
  //       const skip = (page - 1) * limit;
  
  //       const sortObj: any = {};
  //       if (sortBy) {
  //         sortObj[sortBy] = sortDirection === 'asc' ? 1 : -1;
  //       }
  
  //       // Execute queries
  //       const [users, totalCount, activeCount, blockedCount] = await Promise.all([
  //         User.find(query)
  //           .sort(sortObj)
  //           .skip(skip)
  //           .limit(limit)
  //           .select('name email isActive role createdAt')
  //           .lean(),
  //         User.countDocuments(query),
  //         User.countDocuments({ ...query, isActive: true }),
  //         User.countDocuments({ ...query, isActive: false })
  //       ]);
  
  //       const mappedUsers = users.map(user => ({
  //         id: user._id.toString(),
  //         name: user.name || '',
  //         email: user.email || '',
  //         profilePicture: '',
  //         isActive: user.isActive || false,
  //         role: user.role || 'user',
  //         createdAt: user.createdAt ? user.createdAt.toISOString() : '',
  //         updatedAt: '',
  //         lastLoginAt: ''
  //       }));
  
  //       return {
  //         users: mappedUsers,
  //         totalCount,
  //         activeCount,
  //         blockedCount
  //       };
  
  //     } catch (error) {
  //       console.error("Error in debounced search repository:", error);
  //       throw error;
  //     }
  // };




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
  
  


  }