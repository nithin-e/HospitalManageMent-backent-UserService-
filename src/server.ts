import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import "dotenv/config";
import connectDB from "./config/mongo";

// Import controllers
import applyDoctorControllerr from './Controller/implementation/applyDoctorController';
import fetchAllDoctorr from './Controller/implementation/fectingAllDoctorsController';
import fetchAllUsersControllerr from './Controller/implementation/fectingAllUsersController';
import updateDoctorAndUserAfterPaymentController from './Controller/implementation/updateDoctorAndUserAfterPayment.controller'
import loginControllerr from './Controller/implementation/loginController';
import registrationControllerr from './Controller/implementation/registretionController'
// import userBlockAndUnblockControllerr from '../src/Controllerr/implementation/UserBlockAndUnblockController'

//import services
import applyDoctorService from './Services/implementation/applyDoctorService';
import fetchAllDoctorService from './Services/implementation/fectingAllDoctorsService';
import fetchAllUserService from './Services/implementation/fectingAllUsersService';
 import updateDoctorAndUserAfterPaymentService from './Services/implementation/updateDoctorAndUserAfterPayment.service'
import loginService from "./Services/implementation/loginService"
import registretionService from './Services/implementation/registretionService'
// import userBlockAndUnblockService from '../src/Servicess/implementation/UserBlockAndUnblockService'

//import repository
import applyDoctorRepo from "./repositories/implementation/applyDoctorRepo"
import fetchAllDoctorRepo from "./repositories/implementation/fectingAllDoctorsRepo"
import fetchAllUserRepo from "./repositories/implementation/fectingAllUsersRepo"
import updateDoctorAndUserAfterPaymentRepo from './repositories/implementation/updateDoctorAndUserAfterPayment.repository'
import loginRepo from "./repositories/implementation/loginRepo"
import registretionRepo from './repositories/implementation/registretionRepo'
// import userBlockAndUnblockRepo from './repositoriess/implementation/UserBlockAndUnblockRepo'








//login user
const LoginRepo=new loginRepo()
const LoginService=new loginService(LoginRepo)
const LoginController=new loginControllerr(LoginService)

//registretion 
const RegistretionRepo=new registretionRepo()
const RegistretionService=new registretionService(RegistretionRepo)
const RegistrationController=new registrationControllerr(RegistretionService)

// applydoctor 
const ApplyDoctorRepo = new applyDoctorRepo()
const ApplyDoctorService = new applyDoctorService(ApplyDoctorRepo)
const ApplyDoctorController = new applyDoctorControllerr(ApplyDoctorService);

//fecting doctor
const FetchAllDoctorRepo= new fetchAllDoctorRepo()
const FetchAllDoctorService=new fetchAllDoctorService(FetchAllDoctorRepo)
const FetchAllDoctor =new fetchAllDoctorr(FetchAllDoctorService)

//fecting User
const FetchAllUserRepo= new fetchAllUserRepo()
const FetchAllUserService=new fetchAllUserService(FetchAllUserRepo)
const fetchAllUsersController =new fetchAllUsersControllerr(FetchAllUserService)



// UpdateDoctorAndUserAfterPayment
const UpdateDoctorAndUserAfterPaymentRepo=new updateDoctorAndUserAfterPaymentRepo()
const  UpdateDoctorAndUserAfterPaymentService = new updateDoctorAndUserAfterPaymentService(UpdateDoctorAndUserAfterPaymentRepo)
const UpdateDoctorAndUserAfterPaymentController = new updateDoctorAndUserAfterPaymentController(UpdateDoctorAndUserAfterPaymentService)


// Fix import paths - ensure these files exist and are exported correctly
import userBlockAndUnblockController from './Controller/implementation/userBlockAndUnblock.controller';
import userBlockAndUnblockService from './Services/implementation/userBlockAndUnblock.service';
import userBlockAndUnblockRepo from './repositories/implementation/userBlockAndUnblock.repository';

// userblockandunblock instantiation
const UserBlockAndUnblockRepo = new userBlockAndUnblockRepo();
const UserBlockAndUnblockService = new userBlockAndUnblockService(UserBlockAndUnblockRepo);
const UserBlockAndUnblockController = new userBlockAndUnblockController(UserBlockAndUnblockService);

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
  Register: RegistrationController.signup,
  CheckUser: RegistrationController.checkUser,
  LoginUser: LoginController.login,
  changingUserPassWord: LoginController.changeUserPassword,
  ResetPassword: LoginController.forgotPassword,
  FetchAllDoctors:FetchAllDoctor.getAllDoctors,
  UpdateDoctorStatusAfterAdminApprove:ApplyDoctorController.UpdateDoctorStatusAfterAdminApprove,
  HandleStripeWebhookUpdateUser:UpdateDoctorAndUserAfterPaymentController.handleStripeWebhookUpdateUser,
//  HandleStripeWebhookUpdateUser: UpdateDoctorAndUserAfterPaymentController.handleStripeWebhookUpdateUser.bind(UpdateDoctorAndUserAfterPaymentController),
  DeleteDoctorAfterAdminReject:UpdateDoctorAndUserAfterPaymentController.deleteDoctorAfterAdminReject,
  FetchDoctorDashBoardData:FetchAllDoctor.getDoctorByEmail,
  ApplyDoctor :ApplyDoctorController.applyForDoctor,
  FetchAllUsers: fetchAllUsersController.getAllUsers,
  fectingUserProfileDatas:fetchAllUsersController.getUserByEmail,
  ChangingUserInfo: LoginController.updateUserInformation,
  SearchUsers:fetchAllUsersController.searchUsers,
  SearchDoctors:fetchAllUsersController.searchDoctors,
  BlockUser: UserBlockAndUnblockController.blockUser.bind(UserBlockAndUnblockController),
  UnblockUser: UserBlockAndUnblockController.unblockUser.bind(UserBlockAndUnblockController),
  fecthingUserDetailsThroughSockets:fetchAllUsersController.getUserDetailsViaSocket,
  blockingDoctor:UserBlockAndUnblockController.blockDoctor
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