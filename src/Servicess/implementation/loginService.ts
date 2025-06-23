import { IloginInerfaceService } from "../interface/loginServiceInterFace";
import LoginRepository from "../../repositoriess/implementation/loginRepo"
import bcrypt from "../../services/bcrypt";
const jwt = require('jsonwebtoken');


export default class LoginService implements IloginInerfaceService{
    private loginRepo: LoginRepository;
  
    constructor(loginRepo: LoginRepository) {
      this.loginRepo = loginRepo;
    }
  
    user_login = async (loginData: { email: string; password: string }) => {
      try {
        console.log('.login usecase...', loginData);
        
        const response = await this.loginRepo.checkingUserExist(loginData);
        if (!response) {
          throw new Error("No user data returned from repository")
        }
    
        console.log('response from use case', response);
    
        if (response.error === 'Invalid credentials') {
          return { message: response.error }
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
    
        return { user: response, accessToken, refreshToken };
      } catch (error) {
        console.error("Error in login use case:", error);
        throw error;
      }
    };


   ForgetPassword = async (loginData: { email: string; newPassword : string }) => {
      try {
        console.log('.login usecase...', loginData);
        
        // Hash the new password
       const hashedPassword = await bcrypt.securePassword(loginData.newPassword );
       console.log('user pass hashed',hashedPassword);
       
        
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



    changeUser_Password = async (loginData: { email: string; password: string }) => {
      try {
          // Hash the new password
          const hashedPassword = await bcrypt.securePassword(loginData.password); // Using bcrypt.hash directly
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


  changingUser_Information = async (userData: { 
    email: string; 
    name: string; 
    phoneNumber: string 
}) => {
    try {
        const response = await this.loginRepo.changing_User___Information({
            email: userData.email,
            name: userData.name,
            phoneNumber: userData.phoneNumber
        });
        
        console.log('Response from repository:', response);
        return response;
        
    } catch (error) {
        console.error("Error in change user information service:", error);
        throw error;
    }
};



  }