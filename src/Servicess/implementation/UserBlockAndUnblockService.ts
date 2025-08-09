import { IUserBlockAndUnblockService } from "../interface/UserBlockAndUnblockInterFace"
import UserBlockAndUnblockRepository from "../../repositoriess/implementation/UserBlockAndUnblockRepo"
import { UserResponse } from "../../entities/user_interface"
import { IUserBlockAndUnblockServiceRepo } from "../../repositoriess/interface/UserBlockAndUnblockInterFace"




export default class userAndUnblockService implements IUserBlockAndUnblockService{

    private userBlockAndUnblockRepo:IUserBlockAndUnblockServiceRepo
    constructor(userBlockAndUnblockRepo:IUserBlockAndUnblockServiceRepo) {
        this.userBlockAndUnblockRepo=userBlockAndUnblockRepo
    }
  

    BlockingUser=async (userId:string):Promise <boolean>=>{
        try {

            console.log('id kittando nokke inside the usecase',typeof userId)
          const response= await this.userBlockAndUnblockRepo.blocking_User(userId)
           console.log('showing responce from usecase',response)
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


    unBlockingUser=async (userId:string):Promise<boolean>=>{
        try {

          const response= await this.userBlockAndUnblockRepo.unBlocking_User(userId)
           
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


   BlockingDoctor = async (  email: string ):Promise <boolean> => {
    try {
        const response = await this.userBlockAndUnblockRepo.blockingDoctor(email);
        return response;
    } catch (error) {
        console.error("Error in login use case:", error);
        throw error;
    }
}


}