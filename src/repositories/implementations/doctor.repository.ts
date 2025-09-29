import { StatusUpdateResponse } from 'src/entities/user_interface';
import {
    DoctorApplicationResult,
    DoctorFormData,
    RepositoryDoctorsResponse,
    RepositorySingleDoctorResponsee,
    SearchDoctorResponse,
    SearchParamss,
} from '../../interfaces/types';
import { DoctorDb } from '../../entities/doctor_schema';
import { User } from '../../entities/user_schema';
import { IApplyDoctorRepository } from '../interfaces/IDoctorRepository';
import { injectable } from 'inversify';
import { IDoctorRepository } from '../interfaces/IDoctorsRepository';

@injectable()
export default class DoctorRepository
    implements IDoctorRepository, IApplyDoctorRepository
{
    async searchDoctors(params: SearchParamss): Promise<SearchDoctorResponse> {
        try {
            console.log('Search doctors params:', params);

            const { searchQuery, sortBy, sortDirection, page, limit } = params;
            const query: Record<string, unknown> = {};

            // Search query logic
            if (searchQuery && searchQuery.trim()) {
                query.$or = [
                    { firstName: { $regex: searchQuery, $options: 'i' } },
                    { lastName: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } },
                    { specialty: { $regex: searchQuery, $options: 'i' } },
                ];
            }

            const skip = (page - 1) * limit;

            const sortObj: Record<string, 1 | -1> = {};
            if (sortBy) {
                sortObj[sortBy] = sortDirection === 'asc' ? 1 : -1;
            } else {
                // Default sort by createdAt descending
                sortObj.createdAt = -1;
            }

            // Execute all queries in parallel
            const [
                doctors,
                totalCount,
                approvedCount,
                pendingCount,
                declinedCount,
            ] = await Promise.all([
                DoctorDb.find(query)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .select(
                        '_id firstName lastName email phoneNumber licenseNumber medicalLicenseNumber specialty qualifications agreeTerms profileImageUrl medicalLicenseUrl status isActive createdAt'
                    )
                    .lean(),
                DoctorDb.countDocuments(query),
                DoctorDb.countDocuments({ ...query, status: 'approved' }),
                DoctorDb.countDocuments({ ...query, status: 'pending' }),
                DoctorDb.countDocuments({ ...query, status: 'declined' }),
            ]);

            // Map to strict DoctorDTO format - INCLUDING createdAt
            const mappedDoctors = doctors.map((doctor) => ({
                id: doctor._id.toString(),
                firstName: doctor.firstName || '',
                lastName: doctor.lastName || '',
                email: doctor.email || '',
                phoneNumber: doctor.phoneNumber || '',
                licenseNumber: doctor.licenseNumber || '',
                medicalLicenseNumber: doctor.medicalLicenseNumber || '',
                specialty: doctor.specialty || '',
                qualifications: doctor.qualifications || '',
                agreeTerms: doctor.agreeTerms || false,
                profileImageUrl: doctor.profileImageUrl || '',
                medicalLicenseUrl: doctor.medicalLicenseUrl || '',
                status: doctor.status || 'pending',
                isActive: doctor.isActive ?? true,
                createdAt: doctor.createdAt
                    ? doctor.createdAt
                    : new Date().toISOString(),
            }));

            return {
                doctors: mappedDoctors,
                totalCount,
                approvedCount,
                pendingCount,
                declinedCount,
                success: true,
            };
        } catch (error) {
            console.error('Error in search doctors repository:', error);
            throw error;
        }
    }

    applyForDoctor = async (
        doctorData: DoctorFormData
    ): Promise<DoctorApplicationResult> => {
        try {
            console.log('inside the repo1', doctorData);

            if (!doctorData.email || doctorData.email === '') {
                return {
                    success: false,
                    message:
                        'Please use your logged-in email address for the application.',
                };
            }

            const existingDoctor = await DoctorDb.findOne({
                email: doctorData.email,
            });
            const currentUser = await User.findById(doctorData.userId);

            if (existingDoctor) {
                return {
                    success: false,
                    message:
                        'You have already applied. Please wait for a response.',
                    // No doctor property since it's optional
                };
            }

            if (!currentUser || currentUser.email !== doctorData.email) {
                return {
                    success: false,
                    message:
                        'Please use your logged-in email address for the application.',
                    // No doctor property since it's optional
                };
            }

            const newDoctor = new DoctorDb({
                firstName: doctorData.firstName,
                lastName: doctorData.lastName,
                email: doctorData.email,
                phoneNumber: doctorData.phoneNumber,
                licenseNumber: doctorData.licenseNumber,
                specialty: doctorData.specialty,
                qualifications: doctorData.qualifications,
                medicalLicenseNumber: doctorData.medicalLicenseNumber,
                profileImageUrl: doctorData.profileImageUrl,
                medicalLicenseUrl: doctorData.medicalLicenseUrl,
                agreeTerms: doctorData.agreeTerms,
                status: 'pending',
                userId: doctorData.userId,
            });

            const savedDoctor = await newDoctor.save();
            console.log('Doctor saved successfully:', savedDoctor._id);

            return {
                success: true,
                message:
                    "Application submitted successfully. We'll review your details soon.",
                doctor: {
                    id: savedDoctor._id.toString(),
                    firstName: savedDoctor.firstName,
                    lastName: savedDoctor.lastName,
                    email: savedDoctor.email,
                    phoneNumber: savedDoctor.phoneNumber,
                    specialty: savedDoctor.specialty,
                    status: savedDoctor.status,
                    profileImageUrl: savedDoctor.profileImageUrl,
                    medicalLicenseUrl: savedDoctor.medicalLicenseUrl,
                },
            };
        } catch (error) {
            console.error('Error saving doctor:', error);

            return {
                success: false,
                message:
                    'An error occurred while processing your application. Please try again later.',
                // No doctor property since it's optional
            };
        }
    };

    updateDoctorStatusAfterAdminApproval = async (
        email: string
    ): Promise<StatusUpdateResponse> => {
        try {
            const updatedDoctor = await DoctorDb.findOneAndUpdate(
                { email: email },
                { status: 'proccesing' },
                { new: true }
            );

            console.log('plase check this response in repo', updatedDoctor);

            if (!updatedDoctor) {
                return {
                    success: false,
                };
            }

            return {
                success: true,
            };
        } catch (error) {
            console.error('Error updating doctor status:', error);

            return {
                success: false,
                message: 'Failed to update doctor status',
                error: (error as Error).message,
            };
        }
    };

    async getAllDoctors(): Promise<RepositoryDoctorsResponse> {
        try {
            const doctors = await DoctorDb.find();
            return {
                success: true,
                data: doctors,
                message: 'Doctors fetched successfully',
            };
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    }

    async getDoctorByEmail(
        email: string
    ): Promise<RepositorySingleDoctorResponsee> {
        try {
            console.log('repo before res', email);
            const doctor = await DoctorDb.findOne({ email: email });
            console.log('repo after res', doctor);

            return {
                success: true,
                doctor: doctor,
                message: doctor
                    ? 'Doctor found successfully'
                    : 'Doctor not found',
            };
        } catch (error) {
            console.error('Error fetching doctor in repository:', error);
            throw error;
        }
    }

    async blockDoctor(doctorEmail: string): Promise<boolean> {
        try {
            const result = await DoctorDb.updateOne(
                { email: doctorEmail },
                { $set: { isActive: false } }
            );

            return true;
        } catch (error) {
            console.error('Error blocking doctor in repository:', error);
            throw error;
        }
    }
}
