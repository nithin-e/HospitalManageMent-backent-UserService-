import { userData,UserResponse } from "../../entities/user_interface";
import bcrypt from "../../services/bcrypt";
import UserRepository from "../../repositoriess/implementation/registretionRepo";
import { IRegisterService } from "../interface/registretionServiceFaceInterFace";
const jwt = require('jsonwebtoken');

export default class RegistartionService implements IRegisterService {

  private userRepo: UserRepository;
  constructor(userRepo: UserRepository) {
    this.userRepo= userRepo
  }
  
  user_registration = async (userData: userData): Promise<{
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

        const response = await this.userRepo.saveUser(newUserData);
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
  



    checkUser = async ( email: any,phoneNumber:any) => {
      try {

        console.log('allhamdhillillah',email)
        
        const user = await this.userRepo.checkUser(email,phoneNumber);
        console.log('return vanno',user)
        
        if (user) {
          return { message: "user already have an account" }
        } else {
          return { message: "user not registered" }
        }
      } catch (error: unknown) {
        return { message: (error as Error).message };
      }
    };
}