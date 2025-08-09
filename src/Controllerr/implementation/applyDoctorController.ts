
import * as grpc from '@grpc/grpc-js';
import { ApplyDoctorRequest, ApplyDoctorResponse,
  UpdateDoctorStatusAfterAdminApproveRequest,
  UpdateDoctorStatusAfterAdminApproveResponse
 } from '../../allTypes/types';
import { IapplyDoctorService } from '../../Servicess/interface/applyDoctorServicesInterface';

type ApplyDoctorCall = grpc.ServerUnaryCall<ApplyDoctorRequest, ApplyDoctorResponse>;
type UpdateStatusCall = grpc.ServerUnaryCall<UpdateDoctorStatusAfterAdminApproveRequest, UpdateDoctorStatusAfterAdminApproveResponse>;

type GRPCCallback<T> = grpc.sendUnaryData<T>;


export default class applyDoctorController  {
  private applyDoctorService: IapplyDoctorService;

  constructor(ApplyDoctorService:IapplyDoctorService) {
    this.applyDoctorService = ApplyDoctorService; 
  }


  applyForDoctor = async (call: ApplyDoctorCall,  callback: GRPCCallback<ApplyDoctorResponse>) => {
    console.log('check the doctor data inside the controller:',call.request)
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
      documentUrls: call.request.document_urls, 
    };


  
    try {
      const response = await this.applyDoctorService.apply_For_doctor(doctorData);
      const grpcResponse: ApplyDoctorResponse = {
        success: true, 
        id: response.id,
        first_name: response.firstName,
        last_name: response.lastName,
        email: response.email,
        phone_number: call.request.phone_number, 
        specialty: call.request.specialty, 
        status: response.status,
        message: response.message || 'Doctor application submitted successfully',
      };
  
      callback(null, grpcResponse);
  
     
    } catch (error) {
      console.log('Error in applyForDoctor:', error);
      const grpcError = {
        code: grpc.status.INTERNAL,
        message: (error as Error).message,
      };
      callback(grpcError, null);
    }
  };


  UpdateDoctorStatusAfterAdminApprove = async (call: UpdateStatusCall, callback: GRPCCallback<UpdateDoctorStatusAfterAdminApproveResponse>) => {
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
