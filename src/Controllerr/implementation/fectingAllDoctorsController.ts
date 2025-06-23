import * as grpc from '@grpc/grpc-js';
import FetchDoctorService from '../../Servicess/implementation/fectingAllDoctorsService';
import { IfectingAllDoctorsController } from '../interFaces/fectingAllDoctorsInterFace';

export default class FetchController implements IfectingAllDoctorsController{
    private FetchDoctorService: FetchDoctorService;

    constructor(FetchDoctorService:FetchDoctorService) {
        this.FetchDoctorService = FetchDoctorService;
    }

    fetchAllDoctors = async (call: any, callback: any) => {
        try {
            const doctorsResponse = await this.FetchDoctorService.fectingDoctor_Data();
            const doctors = doctorsResponse.data; 
            
            const response = {
                doctors: doctors.map((doctor: any) => ({
                    id: doctor.id,
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                    email: doctor.email,
                    phoneNumber: doctor.phoneNumber,
                    licenseNumber: doctor.licenseNumber,
                    medicalLicenseNumber: doctor.medicalLicenseNumber,
                    specialty: doctor.specialty,
                    qualifications: doctor.qualifications,
                    agreeTerms: doctor.agreeTerms,
                    profileImageUrl: doctor.profileImageUrl,
                    medicalLicenseUrl: doctor.medicalLicenseUrl,
                    status: doctor.status,
                    createdAt: doctor.createdAt
                }))
            };

            console.log('check the result for fecting doctors',response);
            
            callback(null, response);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            const grpcError = {
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Internal server error'
            };
            callback(grpcError, null);
        }
    };

    fetchingSingleDoctor = async (call: any, callback: any) => {
        try {
          const { email } = call.request;
          console.log('controller before res', email);
          
          if (!email) {
            const grpcError = {
              code: grpc.status.INVALID_ARGUMENT,
              message: 'Email is required'
            };
            return callback(grpcError, null);
          }
      
          const doctorResponse = await this.FetchDoctorService.fetchSingleDoctorByEmail(email);
          
          // Check if doctor exists
          if (!doctorResponse.data) {
            const grpcError = {
              code: grpc.status.NOT_FOUND,
              message: 'Doctor not found'
            };
            return callback(grpcError, null);
          }
      
          const doctor = doctorResponse.data;
          
          // Match the response format defined in the proto - SINGLE doctor, not an array
          const response = {
            doctor: {  // Changed from doctors: [{ ... }] to doctor: { ... }
              id: doctor.id,
              firstName: doctor.firstName,
              lastName: doctor.lastName,
              email: doctor.email,
              phoneNumber: doctor.phoneNumber,
              licenseNumber: doctor.licenseNumber,
              medicalLicenseNumber: doctor.medicalLicenseNumber,
              specialty: doctor.specialty,
              qualifications: doctor.qualifications,
              agreeTerms: doctor.agreeTerms,
              profileImageUrl: doctor.profileImageUrl,
              medicalLicenseUrl: doctor.medicalLicenseUrl,
              status: doctor.status,
              createdAt: doctor.createdAt
            }
          };
      
          console.log('controller after res', response);
          callback(null, response);
        } catch (error) {
          console.error('Error fetching doctor:', error);
          const grpcError = {
            code: grpc.status.INTERNAL,
            message: error instanceof Error ? error.message : 'Internal server error'
          };
          callback(grpcError, null);
        }
      };


    }


