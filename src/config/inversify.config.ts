import { UserController } from '@/controllers/user.controller';
import DoctorPaymentController from '@/controllers/payment.controller';
import { DoctorController } from '@/controllers/doctor.controller';
import DoctorPaymentRepository from '@/repositories/implementations/payment.repository';
import DoctorRepository from '@/repositories/implementations/doctor.repository';
import { IDoctorRepository } from '@/repositories/interfaces/IDoctors.repository';
import { IUserRepository } from '@/repositories/interfaces/IUsers.repository';
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
import { AuthService } from '@/services/implementations/auth.service';
import { IUserService } from '@/services/interfaces/IUser.service';
import { IAccessService } from '@/services/interfaces/IAccess.service';
import { IAuthService } from '@/services/interfaces/IAuthk.service';
import { IAuthRepository } from '@/repositories/interfaces/IAuth.repository';
import { AuthRepository } from '@/repositories/implementations/auth.repository';
import { IAccessRepository } from '@/repositories/interfaces/IAccess.repository';
import AccessRepository from '@/repositories/implementations/access.repository';

const container = new Container();

container.bind<IDoctorRepository>(TYPES.DoctorRepository).to(DoctorRepository);
container.bind<IDoctorService>(TYPES.DoctorService).to(ApplyDoctorService);
container.bind(TYPES.DoctorController).to(DoctorController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind(TYPES.UserController).to(UserController);

container.bind(TYPES.AuthController).to(AuthController);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);

container
    .bind<IDoctorPaymentRepository>(TYPES.DoctorPaymentRepository)
    .to(DoctorPaymentRepository);
container
    .bind<IDoctorPaymentService>(TYPES.DoctorPaymentService)
    .to(DoctorAndUserPaymentService);
container.bind(TYPES.DoctorPaymentController).to(DoctorPaymentController);

container.bind<IAccessRepository>(TYPES.AccessRepository).to(AccessRepository);

container.bind<IAccessService>(TYPES.AccessService).to(AccessService);

container.bind(TYPES.AccessController).to(AccessController);

export { container };
