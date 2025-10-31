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
    TYPES.AccessController
);

export const userGrpcHandlers = {
    UpdateDoctorStatusAfterAdminApprove:
        doctorController.UpdateDoctorStatusAfterAdminApprove.bind(
            doctorController
        ),

    BlockUser: accessController.blockUser.bind(accessController),
    UnblockUser: accessController.unblockUser.bind(accessController),
};
