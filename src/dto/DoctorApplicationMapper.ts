// src/mappers/ApplyDoctorMapper.ts
import {
    ApplyDoctorResponse,
    ApplyDoctorRequest,
    DoctorApplicationResponse,
} from '@/interfaces/types';

export class ApplyDoctorMapper {
    constructor(
        private readonly doctor: DoctorApplicationResponse,
        private readonly requestData: ApplyDoctorRequest
    ) {}

    toGrpcResponse(): ApplyDoctorResponse {
        return {
            success: true,
            id: this.doctor.id?.toString() || '',
            first_name: this.doctor.firstName || '',
            last_name: this.doctor.lastName || '',
            email: this.doctor.email || '',
            phone_number: this.requestData.phone_number || '',
            specialty: this.requestData.specialty || '',
            status: this.doctor.status || '',
            message: 'Doctor application submitted successfully',
        };
    }
}
