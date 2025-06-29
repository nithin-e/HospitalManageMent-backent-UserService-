import { User } from '../../entities/user_schema';

export default class UserBlockAndUnblockRepository {
  async blocking_User(userId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      console.log('Before update:', user.toObject());
      
      // Update the user's isActive status
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true } // This returns the updated document
      );
      
      console.log('After update:', updatedUser?.toObject());
      
      return true; // Indicate successful blocking
    } catch (error) {
      console.error('Error blocking user in repository:', error);
      throw error; 
    }
  }

  async unBlocking_User(userId: string): Promise<boolean> {
    try {
      // First find the user to verify they exist
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      console.log('Before update:', user.toObject());
      
      // Update the user's isActive status
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: true },
        { new: true } // This returns the updated document
      );
      
      console.log('After update:', updatedUser?.toObject());
      
      return true; // Indicate successful unblocking
    } catch (error) {
      console.error('Error unblocking user in repository:', error);
      throw error;
    }
  }
}