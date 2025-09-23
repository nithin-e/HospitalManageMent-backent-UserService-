// dtos/doctor.dto.ts

import { Doctor } from "../interfaces/types";

export interface DoctorDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    medicalLicenseNumber: string;
    specialty: string;
    qualifications: string;
    profileImageUrl: string;
    medicalLicenseUrl: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    agreeTerms:boolean;
  }

  




export const mapDoctorToDTO = (doctor: Doctor): DoctorDTO => ({
  id: doctor.id.toString(),
  firstName: doctor.firstName,
  lastName: doctor.lastName,
  email: doctor.email,
  phoneNumber: doctor.phoneNumber,
  licenseNumber: doctor.licenseNumber,
  medicalLicenseNumber: doctor.medicalLicenseNumber,
  specialty: doctor.specialty,
  qualifications: doctor.qualifications,
  profileImageUrl: doctor.profileImageUrl ||'',
  medicalLicenseUrl: doctor.medicalLicenseUrl || '',
  status: doctor.status,
  isActive: doctor.isActive ?? false,
  createdAt: doctor.createdAt,
  agreeTerms:doctor.agreeTerms ?? false
});
