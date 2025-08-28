
import * as grpc from '@grpc/grpc-js';
import { ApplyDoctorRequest, ApplyDoctorResponse,
  UpdateDoctorStatusAfterAdminApproveRequest,
  UpdateDoctorStatusAfterAdminApproveResponse
 } from '../../allTypes/types';
import { IDoctorService } from '../../Services/interface/applyDoctorServicesInterface';

type ApplyDoctorCall = grpc.ServerUnaryCall<ApplyDoctorRequest, ApplyDoctorResponse>;
type UpdateStatusCall = grpc.ServerUnaryCall<UpdateDoctorStatusAfterAdminApproveRequest, UpdateDoctorStatusAfterAdminApproveResponse>;

type GRPCCallback<T> = grpc.sendUnaryData<T>;


export default class  ApplyDoctorController  {
 private readonly _applyDoctorService: IDoctorService;

  constructor(applyDoctorService: IDoctorService) {
    this._applyDoctorService = applyDoctorService; 
  }
  

  applyForDoctor = async (call: ApplyDoctorCall,  callback: GRPCCallback<ApplyDoctorResponse>) => {



    
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
    }  
    try {
      const response = await this._applyDoctorService.applyForDoctor(doctorData);
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
      const response = await this._applyDoctorService.updateDoctorStatusAfterAdminApproval(email);

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
