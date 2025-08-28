import { userData,UserResponse } from "../../entities/user_interface";
import bcrypt from "../../utility/bcrypt";
import UserRepository from "../../repositories/implementation/registretionRepo";
import { IRegisterService } from "../interface/registretionServiceFaceInterFace";
import { IRegistrationRepository } from "../../repositories/interface/registretionRepoInterFace";
const jwt = require('jsonwebtoken');

export default class RegistartionService  implements IRegisterService {

  private _userRepo: IRegistrationRepository;

  constructor(userRepo: IRegistrationRepository) {
    this._userRepo = userRepo;
  }
  
  userRegistration = async (userData: userData): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}> => {
    try {
       
        const { name, email, password, phone_number, google_id } = userData;

        const hashedPassword = await bcrypt.securePassword(password);
        const newUserData = {
            name,
            email,
            password: hashedPassword,
            phone_number,
            google_id,
        };

        const response = await this._userRepo.saveUser(newUserData);
        console.log('usecase response after signup', response);

        const accessToken = jwt.sign(
            {
                userId: response._id,
                email: response.email,
                role: response.role 
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            {
                userId: response._id,
                email: response.email,
                role: response.role 
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

       

        return {
          user: response,
          accessToken,
          refreshToken,
        };

        
    } catch (error) {
        console.log(error);
        throw error;
    }
};
  



    checkUser = async ( email: string,phoneNumber:string):Promise<UserResponse> => {
      try {

        
        const user = await this._userRepo.checkUser(email,phoneNumber);
        
        return user;
        
      } catch (error: unknown) {
        return { message: (error as Error).message };
      }
    };
}