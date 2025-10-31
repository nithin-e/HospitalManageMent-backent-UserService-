import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { Request, Response } from 'express';
import { sendUnaryData } from '@grpc/grpc-js';
import { IDoctorService } from '@/services/interfaces/IDoctor.service';
import { ApplyDoctorMapper } from '@/dto/DoctorApplicationMapper';
import {
    Doctor,
    UpdateDoctorStatusAfterAdminApproveResponse,
    UpdateStatusCall,
    ApplyDoctorRequest,
    HttpStatusCode,
} from '@/types';
import uploadToS3 from '@/config/s3';
import { DoctorsMapper, SingleDoctorMapper } from '@/dto/DoctorsMapper';

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

            const response =
                await this._doctorService.applyForDoctor(doctorData);

            const result = new ApplyDoctorMapper(
                response,
                req.body
            ).toGrpcResponse();

         

            res.status(HttpStatusCode.OK).json({ data: result });
        } catch (error) {
            console.error('REST applyForDoctor error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
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
            const doctors: Doctor[] = doctorsResponse.data;

            const response = new DoctorsMapper(doctors).toGrpcResponse();

            res.status(HttpStatusCode.OK).json({ data: response });
        } catch (error) {
            console.error('REST getAllDoctors error:', error);

            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
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
            const response = new SingleDoctorMapper(
                doctorResponse.doctor
            ).toGrpcResponse();

           
            res.status(HttpStatusCode.OK).json({ data: response });
        } catch (error) {
            console.error('REST getDoctorByEmail error:', error);
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
            console.error('REST blockDoctor error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
            });
        }
    };

    searchDoctors = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                searchQuery = '',
                sortBy = 'createdAt',
                sortDirection = 'desc',
                page = 1,
                limit = 50,
            } = req.query as unknown as {
                searchQuery?: string;
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
                Number(limit)
            );

            res.status(HttpStatusCode.OK).json({ data: response });
        } catch (error) {
            console.error('REST searchDoctors error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
            });
        }
    };
}
