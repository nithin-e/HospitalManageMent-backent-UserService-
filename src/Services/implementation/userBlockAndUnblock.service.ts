import { IUserBlockAndUnblockService } from "../interface/userBlockAndUnblock.service.interface"
// import UserBlockAndUnblockRepository from "../../repositories/implementation/userBlockAndUnblockRepo"
import { UserResponse } from "../../entities/user_interface"
import { IUserBlockAndUnblockRepository } from "../../repositories/interface/userBlockAndUnblock.repository.interface"
// import { IUserBlockAndUnblockRepository } from "../../repositories/interface/"




export default class  UserBlockService  implements IUserBlockAndUnblockService{

    private userBlockAndUnblockRepo:IUserBlockAndUnblockRepository
    constructor(userBlockAndUnblockRepo:IUserBlockAndUnblockRepository) {
        this.userBlockAndUnblockRepo=userBlockAndUnblockRepo
    }
  

    blockUser=async (userId:string):Promise <boolean>=>{
        try {

            console.log('id kittando nokke inside the usecase',typeof userId)
          const response= await this.userBlockAndUnblockRepo.blockUser(userId)
           console.log('showing responce from usecase',response)
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


    unblockUser=async (userId:string):Promise<boolean>=>{
        try {

          const response= await this.userBlockAndUnblockRepo.unblockUser(userId)
           
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


   blockDoctor = async (  email: string ):Promise <boolean> => {
    try {
        const response = await this.userBlockAndUnblockRepo.blockDoctor(email);
        return response;
    } catch (error) {
        console.error("Error in login use case:", error);
        throw error;
    }
}


}