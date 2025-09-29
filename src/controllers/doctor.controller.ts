import * as grpc from '@grpc/grpc-js';

import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';

import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';

import { IDoctorService } from '@/services/interfaces/IDoctorService';
import { ApplyDoctorMapper } from '@/dto/DoctorApplicationMapper';
import { DoctorsMapper, SingleDoctorMapper } from '@/dto/DoctorsMapper';
import { UserResponse } from '@/entities/user_interface';
import { IGrpcCall, GrpcCallbacks, ApplyDoctorCall, ApplyDoctorResponse, BlockingUser, Doctor, DoctorsResponse, GRPCCallback, RepositorySingleDoctorResponsee, SingleDoctorRequest, SingleDoctorResponse, UpdateDoctorStatusAfterAdminApproveResponse, UpdateStatusCall } from '@/types';

@injectable()
export class DoctorController {
    constructor(
        @inject(TYPES.DoctorService)
        private readonly _doctorService: IDoctorService
    ) {}

    applyForDoctor = async (
        call: ApplyDoctorCall,
        callback: GRPCCallback<ApplyDoctorResponse>
    ) => {
        const doctorData = {
            userId: call.request.userId,
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
            const response =
                await this._doctorService.applyForDoctor(doctorData);

          
            const grpcResponse = new ApplyDoctorMapper(
                response,
                call.request
            ).toGrpcResponse();

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

    UpdateDoctorStatusAfterAdminApprove = async (
        call: UpdateStatusCall,
        callback: GRPCCallback<UpdateDoctorStatusAfterAdminApproveResponse>
    ) => {
        console.log('doctor datas:', call.request);

        const { email } = call.request;
        try {
            const response =
                await this._doctorService.updateDoctorStatusAfterAdminApproval(
                    email
                );

            console.log(
                'checke the responce UpdateDoctorStatusAfterAdminApprove',
                response
            );

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

    getAllDoctors = async (
        call: ServerUnaryCall<Record<string, never>, DoctorsResponse>,
        callback: sendUnaryData<DoctorsResponse>
    ): Promise<void> => {
        try {
            const doctorsResponse = await this._doctorService.getAllDoctors();
            const doctors: Doctor[] = doctorsResponse.data;

            // ✅ Use mapper
            const response = new DoctorsMapper(doctors).toGrpcResponse();

            console.log(
                'Check the response while fetching all doctors',
                response
            );
            callback(null, response);
        } catch (error) {
            const grpcError: ServiceError = {
                code: grpc.status.INTERNAL,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
                name: 'Internal Server Error',
                details: '',
                metadata: new grpc.Metadata(),
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
                    metadata: new grpc.Metadata(),
                };
                return callback(grpcError, null);
            }

            const doctorResponse =
                await this._doctorService.getDoctorByEmail(email);

            if (!doctorResponse.doctor) {
                const grpcError: ServiceError = {
                    code: grpc.status.NOT_FOUND,
                    message: 'Doctor not found',
                    name: 'Not Found',
                    details: '',
                    metadata: new grpc.Metadata(),
                };
                return callback(grpcError, null);
            }

            const grpcResponse = new SingleDoctorMapper(
                doctorResponse.doctor
            ).toGrpcResponse();
            callback(null, grpcResponse);
        } catch (error) {
            const grpcError: ServiceError = {
                code: grpc.status.INTERNAL,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
                name: 'Internal Server Error',
                details: '',
                metadata: new grpc.Metadata(),
            };
            callback(grpcError, null);
        }
    };

    blockDoctor = async (
        call: ServerUnaryCall<BlockingUser, boolean>,
        callback: sendUnaryData<UserResponse>
    ) => {
        try {
            console.log('check this call request', call.request);
            const { email } = call.request;

            const response = await this._doctorService.blockDoctor(email);
            console.log('check here ', response);

            callback(null, { success: response });
        } catch (error) {
            console.error(
                'Error updating doctor and user after payment:',
                error
            );
            const grpcError = {
                code: grpc.status.INTERNAL,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
            };
            callback(grpcError, null);
        }
    };


      searchDoctors = async (
        call: IGrpcCall,
        callback: GrpcCallbacks
    ): Promise<void> => {
        try {
            console.log('Doctor search request:', call.request);

            const {
                searchQuery = '',
                sortBy = 'createdAt',
                sortDirection = 'desc',
                page = 1,
                limit = 50,
            } = call.request;

            const response = await this._doctorService.searchDoctors(
                searchQuery,
                sortBy,
                sortDirection,
                page,
                limit
            );

            callback(null, response);
        } catch (error) {
            console.log('Error in doctor search:', error);
            const grpcError = {
                code: 13, // INTERNAL error code
                message: (error as Error).message,
            };
            // callback(grpcError, null);
        }
    };
}
