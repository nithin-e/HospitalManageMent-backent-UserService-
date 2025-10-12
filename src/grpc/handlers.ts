import { container } from '@/config/inversify.config';
import { UserController } from '@/controllers/user.controller';
import { DoctorController } from '@/controllers/doctor.controller';
import { TYPES } from '@/types/inversify';
import { AuthController } from '@/controllers/auth.controller';
import { AccessController } from '@/controllers/access.controller';
import PaymentController from '@/controllers/payment.controller';

export const authController = container.get<AuthController>(
    TYPES.AuthController
);

export const doctorController = container.get<DoctorController>(
    TYPES.DoctorController
);
export const userController = container.get<UserController>(
    TYPES.UserController
);

export const paymentController = container.get<PaymentController>(
    TYPES.DoctorPaymentController
);

export const accessController = container.get<AccessController>(
    TYPES.UserBlockAndUnblockController
);

export const userGrpcHandlers = {
    Register: authController.signup,
    CheckUser: authController.checkUser,
    LoginUser: authController.login,
    changingUserPassWord: authController.changeUserPassword,
    ResetPassword: authController.forgotPassword,
    FetchAllDoctors: doctorController.getAllDoctors,
    UpdateDoctorStatusAfterAdminApprove:
        doctorController.UpdateDoctorStatusAfterAdminApprove,
    HandleStripeWebhookUpdateUser:
        paymentController.handleStripeWebhookUpdateUser,
    DeleteDoctorAfterAdminReject:
        paymentController.deleteDoctorAfterAdminReject,
    FetchDoctorDashBoardData: doctorController.getDoctorByEmail,
    ApplyDoctor: doctorController.applyForDoctor,
    // FetchAllUsers: userController.getAllUsers,
    fectingUserProfileDatas: userController.getUserByEmail,
    ChangingUserInfo: authController.updateUserInformation,
    SearchUsers: userController.searchUsers,
    SearchDoctors: doctorController.searchDoctors,
    BlockUser: accessController.blockUser,
    UnblockUser: accessController.unblockUser,
    fecthingUserDetailsThroughSockets: userController.getUserDetailsViaSocket,
    blockingDoctor: doctorController.blockDoctor,
};
