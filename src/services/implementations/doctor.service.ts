import { mapDoctorToDTO } from '../../dto/doctor.mapper';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { IDoctorService } from '../interfaces/IDoctor.service';
import { DoctorFormData, UserResponse } from '@/entities/user_interface';
import {
    ApplyDoctorRequest,
    ApplyDoctorResponse,
    DoctorApplicationResponse,
    RepositoryDoctorsResponse,
    RepositorySingleDoctorResponsee,
    SearchDoctorResponse,
    StatusUpdateResponse,
} from '@/types';
import { IDoctorRepository } from '@/repositories/interfaces/IDoctors.repository';
import { ApplyDoctorMapper } from '@/dto/doctorApplication.mapper';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export default class DoctorService implements IDoctorService {
    constructor(
        @inject(TYPES.DoctorRepository)
        private readonly _doctorRepo: IDoctorRepository
    ) {}

    getAllDoctors = async (): Promise<RepositoryDoctorsResponse> => {
        try {
            const response = await this._doctorRepo.getAllDoctors();
            const doctorDtos = response.data.map(mapDoctorToDTO);
            return {
                ...response,
                data: doctorDtos,
            };
        } catch (error) {
            console.error(MESSAGES.DOCTOR.FETCH_FAILED, error);
            throw new Error(MESSAGES.DOCTOR.FETCH_FAILED);
        }
    };

    searchDoctors = async (
        searchQuery: string = '',
        sortBy: string = 'createdAt',
        sortDirection: 'asc' | 'desc' = 'desc',
        page: number = 1,
        limit: number = 50,
        role: string
    ): Promise<SearchDoctorResponse> => {
        try {
            const params = {
                searchQuery: searchQuery || '',
                sortBy: sortBy || 'createdAt',
                sortDirection: sortDirection || 'desc',

                page: page || 1,
                limit: limit || 50,
                role: role || '',
            };

            const response = await this._doctorRepo.searchDoctors(params);
            return response;
        } catch (error) {
            console.error(MESSAGES.DOCTOR.SEARCH_FAILED, error);
            throw new Error(MESSAGES.DOCTOR.SEARCH_FAILED);
        }
    };

    getDoctorByEmail = async (
        email: string
    ): Promise<RepositorySingleDoctorResponsee> => {
        try {
            const response = await this._doctorRepo.getDoctorByEmail(email);

            const doctorDtos = response.doctor
                ? mapDoctorToDTO(response.doctor)
                : null;
            return {
                ...response,
                doctor: doctorDtos,
            };
        } catch (error) {
            console.error(MESSAGES.DOCTOR.SINGLE_FETCH_FAILED, error);
            throw new Error(MESSAGES.DOCTOR.SINGLE_FETCH_FAILED);
        }
    };

    applyForDoctor = async (
        doctorData: DoctorFormData,
        requestData: ApplyDoctorRequest
    ): Promise<ApplyDoctorResponse> => {
        try {
            const {
                userId,
                firstName,
                lastName,
                email,
                phoneNumber,
                licenseNumber,
                specialty,
                qualifications,
                medicalLicenseNumber,
                agreeTerms,
                documentUrls,
            } = doctorData;

            if (
                !firstName ||
                !lastName ||
                !email ||
                !specialty ||
                !agreeTerms
            ) {
                throw new Error('Missing required fields');
            }

            const profileImageUrl =
                documentUrls && documentUrls.length > 0
                    ? documentUrls[0]
                    : null;
            const medicalLicenseUrl =
                documentUrls && documentUrls.length > 1
                    ? documentUrls[1]
                    : null;

            const newDoctorData = {
                userId,
                firstName,
                lastName,
                email,
                phoneNumber,
                licenseNumber,
                specialty,
                qualifications,
                medicalLicenseNumber,
                profileImageUrl,
                medicalLicenseUrl,
                agreeTerms:
                    typeof agreeTerms === 'string'
                        ? agreeTerms === 'true'
                        : !!agreeTerms,
            };

            const response =
                await this._doctorRepo.applyForDoctor(newDoctorData);

            const doctorResponse: DoctorApplicationResponse =
                response.success && response.doctor
                    ? {
                          id: response.doctor.id,
                          firstName: response.doctor.firstName,
                          lastName: response.doctor.lastName,
                          email: response.doctor.email,
                          status: response.doctor.status,
                          message: response.message,
                      }
                    : {
                          id: '',
                          firstName: '',
                          lastName: '',
                          email: '',
                          status: 'failed',
                          message: response.message,
                      };

            const mapper = new ApplyDoctorMapper(doctorResponse, requestData);
            return mapper.toGrpcResponse();
        } catch (error) {
            console.error(MESSAGES.DOCTOR.APPLY_FAILED, error);
            return {
                success: false,
                message: MESSAGES.DOCTOR.APPLY_FAILED,
            } as ApplyDoctorResponse;
        }
    };

    updateDoctorStatusAfterAdminApproval = async (
        email: string
    ): Promise<StatusUpdateResponse> => {
        try {
            const response =
                await this._doctorRepo.updateDoctorStatusAfterAdminApproval(
                    email
                );
            return response;
        } catch (error) {
            console.error(MESSAGES.DOCTOR.STATUS_UPDATE_FAILED, error);
            throw new Error(MESSAGES.DOCTOR.STATUS_UPDATE_FAILED);
        }
    };

    blockDoctor = async (email: string): Promise<boolean> => {
        try {
            const response = await this._doctorRepo.blockDoctor(email);
            return response;
        } catch (error) {
            console.error(MESSAGES.DOCTOR.BLOCK_FAILED, error);
            throw new Error(MESSAGES.DOCTOR.BLOCK_FAILED);
        }
    };


     deleteDoctorAfterRejection = async (
        email: string
    ): Promise<UserResponse> => {
        try {
            const response =
                await this._doctorRepo.deleteDoctorAfterAdminReject(
                    email
                );
            return response;
        } catch (error) {
            console.error(MESSAGES.PAYMENT.DELETE_FAILED, error);
            throw new Error(MESSAGES.PAYMENT.DELETE_FAILED);
        }
    };
}
