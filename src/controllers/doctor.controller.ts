import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { Request, Response } from 'express';
import { sendUnaryData } from '@grpc/grpc-js';
import { IDoctorService } from '@/services/interfaces/IDoctor.service';
import {
    UpdateDoctorStatusAfterAdminApproveResponse,
    UpdateStatusCall,
    ApplyDoctorRequest,
    HttpStatusCode,
} from '@/types';
import uploadToS3 from '@/config/s3';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export class DoctorController {
    constructor(
        @inject(TYPES.DoctorService)
        private readonly _doctorService: IDoctorService
    ) {}

    async applyForDoctor(req: Request, res: Response) {
        try {
            
            const files =
                ((req as any).files as {
                    [fieldname: string]: Express.Multer.File[];
                }) || {};

            let profileImageUrl = '';
            let medicalLicenseUrl = '';

            if (files.profileImage?.[0]) {
                profileImageUrl = await uploadToS3(files.profileImage[0]);
            }

            if (files.medicalLicense?.[0]) {
                medicalLicenseUrl = await uploadToS3(files.medicalLicense[0]);
            }

            const body = req.body as unknown as ApplyDoctorRequest;
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
            } = body;

            const doctorData = {
                userId,
                firstName,
                lastName,
                email,
                phoneNumber,
                licenseNumber,
                specialty,
                qualifications,
                medicalLicenseNumber,
                agreeTerms: agreeTerms === true || agreeTerms === 'true',
                documentUrls: [profileImageUrl, medicalLicenseUrl].filter(
                    Boolean
                ),
            };

            const result = await this._doctorService.applyForDoctor(
                doctorData,
                body
            );

            res.status(HttpStatusCode.OK).json({ data: result });
        } catch (error) {
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message,
            });
        }
    }

    async UpdateDoctorStatusAfterAdminApprove(
        call: UpdateStatusCall,
        callback: sendUnaryData<UpdateDoctorStatusAfterAdminApproveResponse>
    ): Promise<void> {
        try {
            const { email } = call.request;

            const result =
                await this._doctorService.updateDoctorStatusAfterAdminApproval(
                    email
                );

            callback(null, result);
        } catch (error) {
            callback(
                {
                    code: 13,
                    message: (error as Error).message,
                },
                null
            );
        }
    }

    getAllDoctors = async (req: Request, res: Response): Promise<void> => {
        try {
            const doctorsResponse = await this._doctorService.getAllDoctors();

            res.status(HttpStatusCode.OK).json({ data: doctorsResponse.data });
        } catch (error) {
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    };

    getDoctorByEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req.query.email as string) || req.body.email;

            const doctorResponse =
                await this._doctorService.getDoctorByEmail(email);

            if (!doctorResponse.doctor) {
                throw new Error('Doctor not found');
            }

            res.status(HttpStatusCode.OK).json({ data: doctorResponse.doctor });
        } catch (error) {
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
            });
        }
    };

    blockDoctor = async (req: Request, res: Response): Promise<void> => {
        try {
            const email =
                (req.body.email as string) || (req.query.email as string);

            const success = await this._doctorService.blockDoctor(email);

            res.status(HttpStatusCode.OK).json({ success });
        } catch (error) {
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: MESSAGES.DOCTOR.BLOCK_FAILED,
            });
        }
    };

    searchDoctors = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                searchQuery = '',
                status = '',
                sortBy = 'createdAt',
                sortDirection = 'desc',
                page = 1,
                limit = 50,
            } = req.query as unknown as {
                searchQuery?: string;
                status?: string;
                sortBy?: string;
                sortDirection?: 'asc' | 'desc';
                page?: number;
                limit?: number;
            };

            const response = await this._doctorService.searchDoctors(
                searchQuery,
                sortBy,
                sortDirection,
                Number(page),
                Number(limit),
                status
            );

            res.status(HttpStatusCode.OK).json({ data: response });
        } catch (error) {
            console.error('error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message:
                    (error as Error).message || MESSAGES.DOCTOR.SEARCH_FAILED,
            });
        }
    };

    deleteDoctorAfterAdminReject = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { email } = req.body;

            const response =
                await this._doctorService.deleteDoctorAfterRejection(email);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message:
                    MESSAGES.PAYMENT.DELETE_SUCCESS ||
                    'Doctor deleted successfully',
                data: response,
            });
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message:
                    (error as Error).message || MESSAGES.PAYMENT.DELETE_FAILED,
            });
        }
    };
}
