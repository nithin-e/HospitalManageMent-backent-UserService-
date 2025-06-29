import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import "dotenv/config";
import connectDB from "./config/mongo";

// Import controllers
import applyDoctorControllerr from '../src/Controllerr/implementation/applyDoctorController';
import fetchAllDoctorr from '../src/Controllerr/implementation/fectingAllDoctorsController';
import fetchAllUsersControllerr from '../src/Controllerr/implementation/fectingAllUsersController';
import updateDoctorAndUserAfterPaymentControllerr from '../src/Controllerr/implementation/UpdateDoctorAndUserAfterPaymentCon'
import loginControllerr from '../src/Controllerr/implementation/loginController';
import registrationControllerr from '../src/Controllerr/implementation/registretionController'
// import userBlockAndUnblockControllerr from '../src/Controllerr/implementation/UserBlockAndUnblockController'

//import services
import applyDoctorService from '../src/Servicess/implementation/applyDoctorService';
import fetchAllDoctorService from '../src/Servicess/implementation/fectingAllDoctorsService';
import fetchAllUserService from '../src/Servicess/implementation/fectingAllUsersService';
import updateDoctorAndUserAfterPaymentService from '../src/Servicess/implementation/UpdateDoctorAndUserAfterPaymentService'
import loginService from "../src/Servicess/implementation/loginService"
import registretionService from '../src/Servicess/implementation/registretionService'
// import userBlockAndUnblockService from '../src/Servicess/implementation/UserBlockAndUnblockService'

//import repository
import applyDoctorRepo from "../src/repositoriess/implementation/applyDoctorRepo"
import fetchAllDoctorRepo from "../src/repositoriess/implementation/fectingAllDoctorsRepo"
import fetchAllUserRepo from "../src/repositoriess/implementation/fectingAllUsersRepo"
import updateDoctorAndUserAfterPaymentRepo from '../src/repositoriess/implementation/UpdateDoctorAndUserAfterPaymentRepo'
import loginRepo from "../src/repositoriess/implementation/loginRepo"
import registretionRepo from './repositoriess/implementation/registretionRepo'
// import userBlockAndUnblockRepo from './repositoriess/implementation/UserBlockAndUnblockRepo'

//login user
const LoginRepo=new loginRepo()
const LoginService=new loginService(LoginRepo)
const LoginControllerr=new loginControllerr(LoginService)

//registretion 
const RegistretionRepo=new registretionRepo()
const RegistretionService=new registretionService(RegistretionRepo)
const RegistrationControllerr=new registrationControllerr(RegistretionService)

// applydoctor 
const ApplyDoctorRepo = new applyDoctorRepo()
const ApplyDoctorService = new applyDoctorService(ApplyDoctorRepo)
const ApplyDoctorControllerr = new applyDoctorControllerr(ApplyDoctorService);

//fecting doctor
const FetchAllDoctorRepo= new fetchAllDoctorRepo()
const FetchAllDoctorService=new fetchAllDoctorService(FetchAllDoctorRepo)
const FetchAllDoctorr =new fetchAllDoctorr(FetchAllDoctorService)

//fecting User
const FetchAllUserRepo= new fetchAllUserRepo()
const FetchAllUserService=new fetchAllUserService(FetchAllUserRepo)
const FetchAllUsersControllerr =new fetchAllUsersControllerr(FetchAllUserService)

// UpdateDoctorAndUserAfterPayment
const UpdateDoctorAndUserAfterPaymentRepo=new updateDoctorAndUserAfterPaymentRepo()
const  UpdateDoctorAndUserAfterPaymentService = new updateDoctorAndUserAfterPaymentService(UpdateDoctorAndUserAfterPaymentRepo)
const UpdateDoctorAndUserAfterPaymentControllerr = new updateDoctorAndUserAfterPaymentControllerr(UpdateDoctorAndUserAfterPaymentService)

//userblockandunblock
// const UserBlockAndUnblockRepo=new userBlockAndUnblockRepo()
// const UserBlockAndUnblockService=new userBlockAndUnblockService(UserBlockAndUnblockRepo)
// const UserBlockAndUnblockControllerr= new userBlockAndUnblockControllerr(UserBlockAndUnblockService)


// Fix import paths - ensure these files exist and are exported correctly
import userBlockAndUnblockControllerr from './Controllerr/implementation/UserBlockAndUnblockController';
import userBlockAndUnblockService from './Servicess/implementation/UserBlockAndUnblockService';
import userBlockAndUnblockRepo from './repositoriess/implementation/UserBlockAndUnblockRepo';

// userblockandunblock instantiation
const UserBlockAndUnblockRepo = new userBlockAndUnblockRepo();
const UserBlockAndUnblockService = new userBlockAndUnblockService(UserBlockAndUnblockRepo);
const UserBlockAndUnblockControllerr = new userBlockAndUnblockControllerr(UserBlockAndUnblockService);

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
connectDB().then(() => {
  console.log('MongoDB connection successful');
}).catch(err => {
  console.error('MongoDB connection failed:', err);
});

// Load proto file for gRPC
console.log('Loading proto file for gRPC...');
const protoPath = path.resolve(__dirname, './proto/user.proto');
console.log('Proto file path:', protoPath);

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
console.log('Proto file loaded successfully');

const grpcObject = grpc.loadPackageDefinition(packageDef) as unknown as any;
const userProto = grpcObject.user_package;

if (!userProto || !userProto.User || !userProto.User.service) {
  console.error("Failed to load the User service from the proto file.");
  process.exit(1);
}
console.log('User service found in proto file');

// Create gRPC server
const grpcServer = new grpc.Server();
console.log('gRPC server created');

// Add gRPC services
console.log('Adding services to gRPC server...');
grpcServer.addService(userProto.User.service, {
  Register: RegistrationControllerr.signup,
  CheckUser: RegistrationControllerr.CheckUser,
  LoginUser: LoginControllerr.login,
  changingUserPassWord: LoginControllerr.ChangingUserPassword,
  ResetPassword: LoginControllerr.ForgetPass,
  FetchAllDoctors:FetchAllDoctorr.fetchAllDoctors,
  UpdateDoctorStatusAfterAdminApprove:ApplyDoctorControllerr.UpdateDoctorStatusAfterAdminApprove,
  UpdateDoctorStatusAndUserRole:UpdateDoctorAndUserAfterPaymentControllerr.UpdateDoctorAndUserAfterPayment,
  DeleteDoctorAfterAdminReject:UpdateDoctorAndUserAfterPaymentControllerr.DeleteDoctorAfter__AdminReject,
  FetchDoctorDashBoardData:FetchAllDoctorr.fetchingSingleDoctor,
  ApplyDoctor :ApplyDoctorControllerr.applyForDoctor,
  FetchAllUsers: FetchAllUsersControllerr.fetchAllUser,
  fectingUserProfileDatas:FetchAllUsersControllerr.fetchingSingleUserData,
  ChangingUserInfo: LoginControllerr.ChangingUserInfo,
  SearchUsers:FetchAllUsersControllerr.searchUserDebounce,
  BlockUser: UserBlockAndUnblockControllerr.blockUser.bind(UserBlockAndUnblockControllerr),
  UnblockUser: UserBlockAndUnblockControllerr.unblockUser.bind(UserBlockAndUnblockControllerr)
});
console.log('Services added to gRPC server');

// Start gRPC server
const startGrpcServer = () => {
  const port = process.env.USER_GRPC_PORT || '3001';
  const domain = process.env.NODE_ENV === 'dev' ? process.env.DEV_DOMAIN : process.env.PRO_DOMAIN_USER;
  console.log(`Preparing to start gRPC server on ${domain}:${port}`);
  
  grpcServer.bindAsync(`${domain}:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      console.error("Error starting gRPC server:", err);
      return;
    }
    grpcServer.start();
    console.log("\x1b[42m\x1b[30m%s\x1b[0m", `🚀 [INFO] gRPC user server started on port: ${bindPort} ✅`);
  });
};

// Start gRPC server
console.log('Starting gRPC server...');
startGrpcServer();