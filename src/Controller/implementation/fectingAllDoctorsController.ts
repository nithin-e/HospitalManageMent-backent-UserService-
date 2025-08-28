import * as grpc from '@grpc/grpc-js';
import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';
import { 
    Doctor, 
    DoctorsResponse, 
    SingleDoctorResponse, 
    SingleDoctorRequest, 
    RepositorySingleDoctorResponsee
} from '../../allTypes/types';
import { IDoctorService } from '../../Services/interface/fectingAllDoctorsInterFace';

export default class DoctorController  {
  private readonly _doctorService: IDoctorService;

    constructor(doctorService: IDoctorService) {
        this._doctorService = doctorService;
    }

    getAllDoctors = async (
        call: ServerUnaryCall<Record<string, never>, DoctorsResponse>,
        callback: sendUnaryData<DoctorsResponse>
    ): Promise<void> => {
        try {
            const doctorsResponse = await this._doctorService.getAllDoctors();
            const doctors: Doctor[] = doctorsResponse.data;
            
            const response: DoctorsResponse = {
                doctors: doctors.map((doctor: Doctor) => ({
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
                    createdAt: doctor.createdAt,
                    isActive: doctor.isActive
                }))
            };
            
            console.log('..........check the response while fetching all doctors', response);
            callback(null, response);
        } catch (error) {
            const grpcError: ServiceError = {
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Internal server error',
                name: 'Internal Server Error',
                details: '',
                metadata: new grpc.Metadata() 
            };
            callback(grpcError, null);
        }
    };

    getDoctorByEmail = async (
        call: ServerUnaryCall<SingleDoctorRequest, SingleDoctorResponse>,
        callback: sendUnaryData<RepositorySingleDoctorResponsee>
    ): Promise<void> => {
        try {
            const { email } = call.request;
            
            if (!email) {
                const grpcError: ServiceError = {
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Email is required',
                    name: 'Invalid Argument',
                    details: '',
                    metadata: new grpc.Metadata() 
                };
                return callback(grpcError, null);
            }

            const doctorResponse = await this._doctorService.getDoctorByEmail(email);

            if (!doctorResponse.doctor) {
                const grpcError: ServiceError = {
                    code: grpc.status.NOT_FOUND,
                    message: 'Doctor not found',
                    name: 'Not Found',
                    details: '',
                    metadata: new grpc.Metadata() 
                };
                return callback(grpcError, null);
            }

            const response: RepositorySingleDoctorResponsee = {
                doctor: {
                    id: doctorResponse.doctor.id,
                    firstName: doctorResponse.doctor.firstName,
                    lastName: doctorResponse.doctor.lastName,
                    email: doctorResponse.doctor.email,
                    phoneNumber: doctorResponse.doctor.phoneNumber,
                    licenseNumber: doctorResponse.doctor.licenseNumber,
                    medicalLicenseNumber: doctorResponse.doctor.medicalLicenseNumber,
                    specialty: doctorResponse.doctor.specialty,
                    qualifications: doctorResponse.doctor.qualifications,
                    agreeTerms: doctorResponse.doctor.agreeTerms,
                    profileImageUrl: doctorResponse.doctor.profileImageUrl,
                    medicalLicenseUrl: doctorResponse.doctor.medicalLicenseUrl,
                    status: doctorResponse.doctor.status,
                    createdAt: doctorResponse.doctor.createdAt,
                    isActive: doctorResponse.doctor.isActive
                }
            };

            console.log('..........check the response while fecting single doctot',response)

            callback(null, response);
        } catch (error) {
            const grpcError: ServiceError = {
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Internal server error',
                name: 'Internal Server Error',
                details: '',
                metadata: new grpc.Metadata() 
            };
            callback(grpcError, null);
        }
    };
}