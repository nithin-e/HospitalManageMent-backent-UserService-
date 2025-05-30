import {User} from '../../entities/user_schema'
import { IfectingAllUsersRepository } from '../interface/fectingAllUsersRepoInterFace';



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


  }