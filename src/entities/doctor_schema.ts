// models/doctor/doctorModel.ts
import mongoose, { Document } from 'mongoose';
import { Doctor } from '../interfaces/types';

const doctorSchema = new mongoose.Schema<Doctor>({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    licenseNumber: String,
    medicalLicenseNumber: String,
    specialty: String,
    qualifications: String,
    agreeTerms: Boolean,
    profileImageUrl: String,
    medicalLicenseUrl: String,
    status: { type: String, default: 'pending' },
    isActive: { type: Boolean, default: true },
});

export const DoctorDb = mongoose.model<Doctor>('Doctor', doctorSchema);
