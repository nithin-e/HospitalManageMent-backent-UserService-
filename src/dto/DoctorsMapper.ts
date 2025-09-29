import {
    DoctorsResponse,
    Doctor,
    RepositorySingleDoctorResponsee,
} from '@/interfaces/types';

export class DoctorsMapper {
    constructor(private readonly doctors: Doctor[]) {}

    toGrpcResponse(): DoctorsResponse {
        return {
            doctors: this.doctors.map((doctor) => ({
                id: doctor.id?.toString() || '',
                firstName: doctor.firstName || '',
                lastName: doctor.lastName || '',
                email: doctor.email || '',
                phoneNumber: doctor.phoneNumber || '',
                licenseNumber: doctor.licenseNumber || '',
                medicalLicenseNumber: doctor.medicalLicenseNumber || '',
                specialty: doctor.specialty || '',
                qualifications: Array.isArray(doctor.qualifications)
                    ? doctor.qualifications.join(', ')
                    : doctor.qualifications || '',
                agreeTerms: doctor.agreeTerms || false,
                profileImageUrl: doctor.profileImageUrl || '',
                medicalLicenseUrl: doctor.medicalLicenseUrl || '',
                status: doctor.status || '',
                createdAt: doctor.createdAt
                    ? new Date(doctor.createdAt).toISOString()
                    : new Date().toISOString(),
                isActive: doctor.isActive || false,
            })),
        };
    }
}

export class SingleDoctorMapper {
    constructor(private readonly doctor: Doctor) {}

    toGrpcResponse(): RepositorySingleDoctorResponsee {
        return {
            doctor: {
                id: this.doctor.id?.toString() || '',
                firstName: this.doctor.firstName || '',
                lastName: this.doctor.lastName || '',
                email: this.doctor.email || '',
                phoneNumber: this.doctor.phoneNumber || '',
                licenseNumber: this.doctor.licenseNumber || '',
                medicalLicenseNumber: this.doctor.medicalLicenseNumber || '',
                specialty: this.doctor.specialty || '',
                qualifications: Array.isArray(this.doctor.qualifications)
                    ? this.doctor.qualifications.join(', ')
                    : this.doctor.qualifications || '',
                agreeTerms: this.doctor.agreeTerms || false,
                profileImageUrl: this.doctor.profileImageUrl || '',
                medicalLicenseUrl: this.doctor.medicalLicenseUrl || '',
                status: this.doctor.status || '',
                createdAt: this.doctor.createdAt
                    ? new Date(this.doctor.createdAt).toISOString()
                    : new Date().toISOString(),
                isActive: this.doctor.isActive || false,
            },
        };
    }
}
