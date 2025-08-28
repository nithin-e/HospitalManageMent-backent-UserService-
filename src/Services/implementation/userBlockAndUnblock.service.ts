import { IUserBlockAndUnblockService } from "../interface/userBlockAndUnblock.service.interface"

import { IUserBlockAndUnblockRepository } from "../../repositories/interface/userBlockAndUnblock.repository.interface"




export default class  UserBlockService  implements IUserBlockAndUnblockService{

  private _userBlockAndUnblockRepo: IUserBlockAndUnblockRepository;

  constructor(userBlockAndUnblockRepo: IUserBlockAndUnblockRepository) {
    this._userBlockAndUnblockRepo = userBlockAndUnblockRepo;
  }
  

    blockUser=async (userId:string):Promise <boolean>=>{
        try {

            console.log('id kittando nokke inside the usecase',typeof userId)
          const response= await this._userBlockAndUnblockRepo.blockUser(userId)
           console.log('showing responce from usecase',response)
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


    unblockUser=async (userId:string):Promise<boolean>=>{
        try {

          const response= await this._userBlockAndUnblockRepo.unblockUser(userId)
           
           
          return response;
    
        } catch (error) {
            console.error("Error in login use case:", error);
            throw error
        }
    }


   blockDoctor = async (  email: string ):Promise <boolean> => {
    try {
        const response = await this._userBlockAndUnblockRepo.blockDoctor(email);
        return response;
    } catch (error) {
        console.error("Error in login use case:", error);
        throw error;
    }
}


}