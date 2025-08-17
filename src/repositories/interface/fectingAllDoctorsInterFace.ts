import {  RepositoryDoctorsResponse, RepositorySingleDoctorResponse, RepositorySingleDoctorResponsee } from '../../allTypes/types';

export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    medicalLicenseNumber: string;
    specialty: string;
    qualifications: string;
    agreeTerms: boolean;
    profileImageUrl?: string;
    medicalLicenseUrl: string;
    status: 'completed' | 'processing';
    createdAt: string;
}

export interface FetchAllDoctorsResponse {
    doctors: Doctor[];
}

export interface IDoctorRepository  {
    getAllDoctors(): Promise<RepositoryDoctorsResponse>;
    getDoctorByEmail(email: string): Promise<RepositorySingleDoctorResponsee>;
}