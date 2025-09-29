import { mapDoctorToDTO } from '../../dto/doctor.mapper';
import { IDoctorRepository } from '../../repositories/interfaces/IDoctorsRepository';
import { inject } from 'inversify';
import { TYPES } from '@/types/inversify';
import { IDoctorService } from '../interfaces/IDoctorService';
import { DoctorFormData } from '@/entities/user_interface';
import { IApplyDoctorRepository } from '@/repositories/interfaces/IDoctorRepository';
import { DoctorApplicationResponse, RepositoryDoctorsResponse, RepositorySingleDoctorResponsee, SearchDoctorResponse, StatusUpdateResponse } from '@/types';

export default class DoctorService
    implements IDoctorService
{
    constructor(
        @inject(TYPES.DoctorRepository)
        private readonly _doctorRepo: IDoctorRepository & IApplyDoctorRepository
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
            console.error('Error in login use case:', error);
            throw error;
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
            console.log('check this responce in service layer', response);
            return response;
        } catch (error) {
            console.error('Error in search doctors service:', error);
            throw error;
        }
    };

    getDoctorByEmail = async (
        email: string
    ): Promise<RepositorySingleDoctorResponsee> => {
        try {
            const response = await this._doctorRepo.getDoctorByEmail(email);
            console.log(
                'check this responce while fecting onedoctor',
                response
            );

            const doctorDtos = response.doctor
                ? mapDoctorToDTO(response.doctor)
                : null;
            return {
                ...response,
                doctor: doctorDtos,
            };
        } catch (error) {
            console.error('Error in doctor fetch use case:', error);
            throw error;
        }
    };

    applyForDoctor = async (
        doctorData: DoctorFormData
    ): Promise<DoctorApplicationResponse> => {
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

            if (response.success && response.doctor) {
                return {
                    id: response.doctor.id,
                    firstName: response.doctor.firstName,
                    lastName: response.doctor.lastName,
                    email: response.doctor.email,
                    status: response.doctor.status,
                    message: response.message,
                };
            } else {
                throw new Error(
                    response.message || 'Doctor application failed'
                );
            }
        } catch (error) {
            console.log('Error in use case:', error);
            throw error;
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
            console.log('Error in use case:', error);
            throw error;
        }
    };

    blockDoctor = async (email: string): Promise<boolean> => {
        try {
            const response = await this._doctorRepo.blockDoctor(email);
            return response;
        } catch (error) {
            console.error('Error in login use case:', error);
            throw error;
        }
    };
}

