import {
  RegistrationController,
  LoginController,
  ApplyDoctorController,
  FetchAllDoctorController,
  FetchAllUserController,
  UpdateDoctorAndUserAfterPaymentController,
  BlockAndUnblockController
} from "../app";

export const userGrpcHandlers = {
  Register: RegistrationController.signup,
  CheckUser: RegistrationController.checkUser,
  LoginUser: LoginController.login,
  changingUserPassWord: LoginController.changeUserPassword,
  ResetPassword: LoginController.forgotPassword,
  FetchAllDoctors: FetchAllDoctorController.getAllDoctors,
  UpdateDoctorStatusAfterAdminApprove: ApplyDoctorController.UpdateDoctorStatusAfterAdminApprove,
  HandleStripeWebhookUpdateUser: UpdateDoctorAndUserAfterPaymentController.handleStripeWebhookUpdateUser,
  DeleteDoctorAfterAdminReject: UpdateDoctorAndUserAfterPaymentController.deleteDoctorAfterAdminReject,
  FetchDoctorDashBoardData: FetchAllDoctorController.getDoctorByEmail,
  ApplyDoctor: ApplyDoctorController.applyForDoctor,
  FetchAllUsers: FetchAllUserController.getAllUsers,
  fectingUserProfileDatas: FetchAllUserController.getUserByEmail,
  ChangingUserInfo: LoginController.updateUserInformation,
  SearchUsers: FetchAllUserController.searchUsers,
  SearchDoctors: FetchAllUserController.searchDoctors,
  BlockUser: BlockAndUnblockController.blockUser,
  UnblockUser: BlockAndUnblockController.unblockUser,
  fecthingUserDetailsThroughSockets: FetchAllUserController.getUserDetailsViaSocket,
  blockingDoctor: BlockAndUnblockController.blockDoctor,
};
