import { IUserBlockAndUnblockService } from "../interface/UserBlockAndUnblockInterFace"
import UserBlockAndUnblockRepository from "../../repositoriess/implementation/UserBlockAndUnblockRepo"




export default class userAndUnblockService implements IUserBlockAndUnblockService{

    private userBlockAndUnblockRepo:UserBlockAndUnblockRepository
    constructor(userBlockAndUnblockRepo:UserBlockAndUnblockRepository) {
        this.userBlockAndUnblockRepo=userBlockAndUnblockRepo
    }
  

    BlockingUser=async (userId:string)=>{
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


    unBlockingUser=async (userId:string)=>{
        try {

            console.log('unblocking tyme check this fastly',userId);
            
          const response= await this.userBlockAndUnblockRepo.unBlocking_User(userId)
           console.log('showing responce from usecase',response)
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


}