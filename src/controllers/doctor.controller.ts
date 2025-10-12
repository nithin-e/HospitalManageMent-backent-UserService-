import * as grpc from '@grpc/grpc-js';

import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify';
import { Request, Response } from 'express';

import { ServerUnaryCall, sendUnaryData, ServiceError } from '@grpc/grpc-js';

import { IDoctorService } from '@/services/interfaces/IDoctor.service';
import { ApplyDoctorMapper } from '@/dto/DoctorApplicationMapper';
import { DoctorsMapper, SingleDoctorMapper } from '@/dto/DoctorsMapper';
import { UserResponse } from '@/entities/user_interface';
import {
    IGrpcCall,
    GrpcCallbacks,
    ApplyDoctorCall,
    ApplyDoctorResponse,
    BlockingUser,
    Doctor,
    DoctorsResponse,
    GRPCCallback,
    RepositorySingleDoctorResponsee,
    SingleDoctorRequest,
    SingleDoctorResponse,
    UpdateDoctorStatusAfterAdminApproveResponse,
    UpdateStatusCall,
    ApplyDoctorRequest,
} from '@/types';
import uploadToS3 from '@/config/s3';

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
                first_name,
                last_name,
                email,
                phone_number,
                license_number,
                specialty,
                qualifications,
                medical_license_number,
                agree_terms,
            } = body;

            const doctorData = {
                userId,
                firstName: first_name,
                lastName: last_name,
                email,
                phoneNumber: phone_number,
                licenseNumber: license_number,
                specialty,
                qualifications,
                medicalLicenseNumber: medical_license_number,
                agreeTerms: agree_terms === true || agree_terms === 'true',
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

            res.status(200).json({ data: result });
        } catch (error) {
            console.error('REST applyForDoctor error:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
    UpdateDoctorStatusAfterAdminApprove = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { email } = req.body;

            const response =
                await this._doctorService.updateDoctorStatusAfterAdminApproval(
                    email
                );

            console.log(
                'Doctor status updated after admin approval:',
                response
            );

            res.json(response);
        } catch (error) {
            console.error(
                'REST UpdateDoctorStatusAfterAdminApprove error:',
                error
            );
            res.status(500).json({ message: (error as Error).message });
        }
    };

    getAllDoctors = async (req: Request, res: Response): Promise<void> => {
        try {
         
            const doctorsResponse = await this._doctorService.getAllDoctors();
            const doctors: Doctor[] = doctorsResponse.data;

           
            const response = new DoctorsMapper(doctors).toGrpcResponse();

            console.log(
                'Check the response while fetching all doctors',
                response
            );

         
            res.status(200).json({ data: response });
        } catch (error) {
            console.error('REST getAllDoctors error:', error);

            res.status(500).json({
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

            const response = new SingleDoctorMapper(
                doctorResponse.doctor
            ).toGrpcResponse();

            // Send JSON response
            res.status(200).json({ data: response });
        } catch (error) {
            console.error('REST getDoctorByEmail error:', error);
            res.status(500).json({
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

            res.status(200).json({ success });
        } catch (error) {
            console.error('REST blockDoctor error:', error);
            res.status(500).json({
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

            res.status(200).json({ data: response });
        } catch (error) {
            console.error('REST searchDoctors error:', error);
            res.status(500).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
            });
        }
    };
}
