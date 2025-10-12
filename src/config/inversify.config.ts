import { UserController } from '@/controllers/user.controller';
import DoctorPaymentController from '@/controllers/payment.controller';
import { DoctorController } from '@/controllers/doctor.controller';
import DoctorPaymentRepository from '@/repositories/implementations/payment.repository';
import DoctorRepository from '@/repositories/implementations/doctor.repository';
import { IDoctorRepository } from '@/repositories/interfaces/IDoctors.repository';
import { IUserRepository } from '@/repositories/interfaces/IUsers.repository';
import { IUserBlockAndUnblockRepository } from '@/repositories/interfaces/IAccess.repository';
import { IDoctorPaymentRepository } from '@/repositories/interfaces/IPayment.repository';
import DoctorAndUserPaymentService from '@/services/implementations/payment.service';
import ApplyDoctorService from '@/services/implementations/doctor.service';
import { IDoctorPaymentService } from '@/services/interfaces/IPayment.service';
import { IDoctorService } from '@/services/interfaces/IDoctor.service';
import { TYPES } from '@/types/inversify';
import { Container } from 'inversify';
import { AuthController } from '@/controllers/auth.controller';
import { UserRepository } from '@/repositories/implementations/user.repository';
import AccessService from '@/services/implementations/access.service';
import { AccessController } from '@/controllers/access.controller';
import UserService from '@/services/implementations/user.service';
import {AuthService} from '@/services/implementations/auth.service';
import { ILoginService } from '@/services/interfaces/ILogin.service';
import { IUserService } from '@/services/interfaces/IUser.service';
import { IAccessService } from '@/services/interfaces/IAccess.service';

const container = new Container();

container.bind<IDoctorRepository>(TYPES.DoctorRepository).to(DoctorRepository);

container.bind<IDoctorService>(TYPES.DoctorService).to(ApplyDoctorService);

container.bind(TYPES.DoctorController).to(DoctorController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind(TYPES.UserController).to(UserController);

container.bind(TYPES.AuthController).to(AuthController);
container.bind<ILoginService>(TYPES.AuthService).to(AuthService);
container.bind<IUserRepository>(TYPES.AuthRepository).to(UserRepository);

container
    .bind<IDoctorPaymentRepository>(TYPES.DoctorPaymentRepository)
    .to(DoctorPaymentRepository);
container
    .bind<IDoctorPaymentService>(TYPES.DoctorPaymentService)
    .to(DoctorAndUserPaymentService);
container.bind(TYPES.DoctorPaymentController).to(DoctorPaymentController);

container
    .bind<IUserBlockAndUnblockRepository>(TYPES.UserBlockRepository)
    .to(UserRepository);

container
    .bind<IAccessService>(TYPES.UserBlockAndUnblockService)
    .to(AccessService);

container.bind(TYPES.UserBlockAndUnblockController).to(AccessController);

export { container };
