import {User} from '../../entities/user_schema'
import { IfectingAllUsersRepository } from '../interface/fectingAllUsersRepoInterFace';




interface SearchParams {
  searchQuery: string;
  sortBy: string;
  sortDirection: string;
  role: string;
  page: number;
  limit: number;
}

export default class FetchAllDataRepository implements IfectingAllUsersRepository{
    
  
    fetchingAllUserData = async () => {
      try {
       
        const users = await User.find({});
        
        return {
          data: users
        }

      } catch (error) {
        console.error("Error fetching all users:", error);
        console.error("Login error in repo:", error);
        throw error;
      }
    };


    fetching_a__SingleUser = async (email: string) => {
      try {
        console.log('Fetching user with email in repo:', email);
        
        // Query the database to get user by email
        const user = await User.findOne({ email: email });
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Return the user data
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: '', // Don't send actual password
          phone_number: user.phoneNumber,
          // google_id: user.google_id || '',
          role: user.role || 'user',
          isActive: user.isActive !== undefined ? user.isActive : true
        };
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
  }

  
  
  searchUserDebounce = async (params: SearchParams) => {
      try {
        const { searchQuery, sortBy, sortDirection, role, page, limit } = params;
        const query: any = {};
        
        console.log('..inside the repo check the params..', params);
  
        // Build search query
        if (searchQuery && searchQuery.trim()) {
          query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } }
          ];
        }
  
        // Add role filter
        if (role && role.trim()) {
          query.role = role;
        }
  
        // Calculate pagination
        const skip = (page - 1) * limit;
  
        // Build sort object
        const sortObj: any = {};
        if (sortBy) {
          sortObj[sortBy] = sortDirection === 'asc' ? 1 : -1;
        }
  
        // Execute queries
        const [users, totalCount, activeCount, blockedCount] = await Promise.all([
          User.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .select('name email isActive role createdAt')
            .lean(),
          User.countDocuments(query),
          User.countDocuments({ ...query, isActive: true }),
          User.countDocuments({ ...query, isActive: false })
        ]);
  
        const mappedUsers = users.map(user => ({
          id: user._id.toString(),
          name: user.name || '',
          email: user.email || '',
          profilePicture: '',
          isActive: user.isActive || false,
          role: user.role || 'user',
          createdAt: user.createdAt ? user.createdAt.toISOString() : '',
          updatedAt: '',
          lastLoginAt: ''
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
  };


  
  


  }