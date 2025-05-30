
import * as grpc from '@grpc/grpc-js';
import ApplyDoctorService from '../../Servicess/implementation/applyDoctorService';
import { IapplyDoctorController } from '../interFaces/applyDoctorInterFace';



export default class applyDoctorController implements IapplyDoctorController {
  private applyDoctorService: ApplyDoctorService;

  constructor(ApplyDoctorService:ApplyDoctorService) {
    this.applyDoctorService = ApplyDoctorService; 
  }
  applyForDoctor = async (call: any, callback: any) => {
    console.log('doctor datas:', call.request);
  
    // Normalize snake_case to camelCase
    const doctorData = {
      userId :call.request.userId, 
      firstName: call.request.first_name,
      lastName: call.request.last_name,
      email: call.request.email,
      phoneNumber: call.request.phone_number,
      licenseNumber: call.request.license_number,
      specialty: call.request.specialty,
      qualifications: call.request.qualifications,
      medicalLicenseNumber: call.request.medical_license_number,
      agreeTerms: call.request.agree_terms,
      documentUrls: call.request.document_urls, // Pass document_urls as is
    };
  
    try {
      const response = await this.applyDoctorService.apply_For_doctor(doctorData);
      console.log('Doctor application successful:', response);
  
      // Return successful response
      callback(null, response);
    } catch (error) {
      console.log('Error in applyForDoctor:', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message,
      };
      callback(grpcError, null);
    }
  };


  UpdateDoctorStatusAfterAdminApprove = async (call: any, callback: any) => {
    console.log('doctor datas:', call.request);
  
    const {email}=call.request
    
  
    try {
      const response = await this.applyDoctorService.UpdateDctorStatus__AfterAdminApprove(email);
      console.log('Doctor application successful:', response);
  
      // Return successful response
      callback(null, response);
    } catch (error) {
      console.log('Error in applyForDoctor:', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message,
      };
      callback(grpcError, null);
    }
  };
  


}
