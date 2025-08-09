import { IloginInerfaceService } from "../interface/loginServiceInterFace";
import LoginRepository from "../../repositoriess/implementation/loginRepo"
import bcrypt from "../../services/bcrypt";
import { UserResponse, UserResponsee } from "../../entities/user_interface";
import { IloginInterFace } from "../../repositoriess/interface/loginRepoInterFace";
const jwt = require('jsonwebtoken');


type LoginResponse = {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  success?:boolean;
} | {
  message: string;
  success?:boolean;
  error?:string
};

export default class LoginService implements IloginInerfaceService{
    private loginRepo: IloginInterFace;
  
    constructor(loginRepo: IloginInterFace) {
      this.loginRepo = loginRepo;
    }
  
    user_login = async (loginData: { email: string; password: string }): Promise<LoginResponse> => {
      try {
        console.log('.login usecase...', loginData);
        
        const response = await this.loginRepo.checkingUserExist(loginData);
        if (!response) {
          throw new Error("No user data returned from repository")
        }
    
       
    
        if (response.error === 'Invalid credentials') {
          console.log('usecase if condition',response)
          return {success:false, message: response.error }
        }
    

        // Include role in the JWT payload
        const accessToken = jwt.sign(
          { 
            userId: response._id, 
            email: response.email,
            role: response.role  
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '1m' }
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

        console.log('response from use case', response);
    
        return { user: response, accessToken, refreshToken,success:true };
      } catch (error) {
        console.error("Error in login use case:", error);
        throw error;
      }
    };


   ForgetPassword = async (loginData: { email: string; newPassword : string }) : Promise<UserResponse> =>{
      try {
        console.log('.login usecase...', loginData);
        
        // Hash the new password
       const hashedPassword = await bcrypt.securePassword(loginData.newPassword );
       
       
        
        const response = await this.loginRepo.SetUpForgetPassword({
          email: loginData.email,
          newPassword: hashedPassword
        });
        
       
    
        console.log('response from use case', response);
        return response;
        
      } catch (error) {
        console.error("Error in forget password use case:", error);
        throw error;
      }
    };



    changeUser_Password = async (loginData: { email: string; password: string }):Promise<UserResponse> => {
      try {
         
          const hashedPassword = await bcrypt.securePassword(loginData.password); 
          console.log('Password hashed successfully');
          
          // Call the repository function
          const response = await this.loginRepo.Changing_the__newPassWord({
              email: loginData.email,
              newPassword: hashedPassword
          });
          
          console.log('Response from repository:', response);
          return response;
          
      } catch (error) {
          console.error("Error in change password service:", error);
          throw error;
      }
  };


  changingUser_Information = async (loginData: { 
    email: string; 
    name: string; 
    phoneNumber: string 
}):Promise<UserResponse> => {
  
    try {
        const response = await this.loginRepo.changing_User___Information({
            email: loginData.email,
            name: loginData.name,
            phoneNumber: loginData.phoneNumber
        });
        
        console.log('Response from repository:', response);
        return response;
        
    } catch (error) {
        console.error("Error in change user information service:", error);
        throw error;
    }
};



  }