import { container } from '@/config/inversify.config';
import upload from '@/config/multer';
import { AuthController } from '@/controllers/auth.controller';
import { DoctorController } from '@/controllers/doctor.controller';
import PaymentController from '@/controllers/payment.controller';
import { UserController } from '@/controllers/user.controller';
import { TYPES } from '@/types/inversify';
import express from 'express';
const userRoute = express.Router();

export const authController = container.get<AuthController>(
    TYPES.AuthController
);

export const userController = container.get<UserController>(
    TYPES.UserController
);

export const doctorController = container.get<DoctorController>(
    TYPES.DoctorController
);

export const paymentController = container.get<PaymentController>(
    TYPES.DoctorPaymentController
);

userRoute.post('/register', authController.signup);
userRoute.post('/loginUser', authController.login);
userRoute.post('/checkUser', authController.checkUser);
userRoute.post('/ChangingUserInfo', authController.updateUserInformation);
userRoute.post('/changing_UserPassWord', authController.changeUserPassword);
userRoute.post('/forgetPassword', authController.forgotPassword);
userRoute.get('/fetchAllUser', userController.getAllUsers);
userRoute.post('/fectingUserProfileData', userController.getUserByEmail);
userRoute.get('/search', userController.searchUsers);

userRoute.post(
    '/applyDoctor',
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'medicalLicense', maxCount: 1 },
    ]),
    doctorController.applyForDoctor.bind(doctorController)
);

userRoute.get('/fecthAllDoctors', doctorController.getAllDoctors);
userRoute.post('/fetchDoctorDashBoardData', doctorController.getDoctorByEmail);
userRoute.post('/blockingDoctor', doctorController.blockDoctor);
userRoute.get('/fecthAllDoctors', doctorController.searchDoctors);
userRoute.get('/doctorPagination', doctorController.searchDoctors);
userRoute.post(
    '/refresh',
    authController.handleRefreshToken.bind(authController)
);

userRoute.post(
    '/deleteDoctorAfterRejection',
    doctorController.deleteDoctorAfterAdminReject
);

// applyDoctor 
export default userRoute;
