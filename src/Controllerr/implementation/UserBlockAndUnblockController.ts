// userBlockAndUnblockController.ts
import { IUserBlockAndUnblockController } from "../interFaces/UserBlockAndUnblockInterface";
import UserBlockAndUnblockService from '../../Servicess/implementation/UserBlockAndUnblockService'

export default class UserBlockAndUnblockController implements IUserBlockAndUnblockController{
  private UserBlockAndUnblockService: UserBlockAndUnblockService;
  constructor(UserBlockAndUnblockService : UserBlockAndUnblockService) {
    this.UserBlockAndUnblockService = UserBlockAndUnblockService
  }

  async blockUser(userId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {

        console.log('kittando id',userId);
        

      const result = await this.UserBlockAndUnblockService.BlockingUser(userId)
      console.log('this is the response in controller',result);
      
      return { success: true };
      
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }



  async unblockUser(userId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {

        console.log('kittando id',userId);
        

      const result = await this.UserBlockAndUnblockService.unBlockingUser(userId)
      console.log('this is the response in controller',result);
      
      return { success: true };
      
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}