import loginRepo from "./repositories/implementation/loginRepository";
import loginService from "./services/implementation/loginService";
import loginController from "./Controller/implementation/loginController";

import registretionRepo from "./repositories/implementation/registretionRepository";
import registretionService from "./services/implementation/registretionService";
import registrationController from "./Controller/implementation/registretionController";

import applyDoctorRepo from "./repositories/implementation/doctorRepository";
import applyDoctorService from "./services/implementation/doctorService";
import applyDoctorController from "./Controller/implementation/doctorController";

import fetchAllDoctorRepo from "./repositories/implementation/allDoctorRepository";
import fetchAllDoctorService from "./services/implementation/allDoctorsService";
import fetchAllDoctorController from "./Controller/implementation/allDoctorsController";

import fetchAllUserRepo from "./repositories/implementation/allUserRepository";
import fetchAllUserService from "./services/implementation/allUsersService";
import fetchAllUserController from "./Controller/implementation/allUsersController";

import updateDoctorAndUserAfterPaymentRepo from "./repositories/implementation/doctorAndUserPaymentRepository";
import updateDoctorAndUserAfterPaymentService from "./services/implementation/doctorAndUserPaymentService";
import updateDoctorAndUserAfterPaymentController from "./Controller/implementation/doctorAndUserPaymentcontroller";

import blockAndUnblockRepo from "./repositories/implementation/blockAndUnblockRepository";
import blockAndUnblockService from "./services/implementation/blockAndUnblockservice";
import blockAndUnblockController from "./Controller/implementation/blockAndUnblockController";

// Instantiate dependencies
const LoginRepo = new loginRepo();
const LoginService = new loginService(LoginRepo);
export const LoginController = new loginController(LoginService);

const RegistretionRepo = new registretionRepo();
const RegistretionService = new registretionService(RegistretionRepo);
export const RegistrationController = new registrationController(RegistretionService);

const ApplyDoctorRepo = new applyDoctorRepo();
const ApplyDoctorService = new applyDoctorService(ApplyDoctorRepo);
export const ApplyDoctorController = new applyDoctorController(ApplyDoctorService);

const FetchAllDoctorRepo = new fetchAllDoctorRepo();
const FetchAllDoctorService = new fetchAllDoctorService(FetchAllDoctorRepo);
export const FetchAllDoctorController = new fetchAllDoctorController(FetchAllDoctorService);

const FetchAllUserRepo = new fetchAllUserRepo();
const FetchAllUserService = new fetchAllUserService(FetchAllUserRepo);
export const FetchAllUserController = new fetchAllUserController(FetchAllUserService);

const UpdateDoctorAndUserAfterPaymentRepo = new updateDoctorAndUserAfterPaymentRepo();
const UpdateDoctorAndUserAfterPaymentService = new updateDoctorAndUserAfterPaymentService(UpdateDoctorAndUserAfterPaymentRepo);
export const UpdateDoctorAndUserAfterPaymentController = new updateDoctorAndUserAfterPaymentController(UpdateDoctorAndUserAfterPaymentService);

const BlockAndUnblockRepo = new blockAndUnblockRepo();
const BlockAndUnblockService = new blockAndUnblockService(BlockAndUnblockRepo);
export const BlockAndUnblockController = new blockAndUnblockController(BlockAndUnblockService);
