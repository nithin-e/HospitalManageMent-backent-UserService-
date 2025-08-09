import { UserResponse } from "../../entities/user_interface";

export interface IUpdateDoctorAndUserAfterPaymentService{
    updateDoctorAndUserAfterPayment(email:string):Promise<UserResponse>;
    DeleteDoctor_AfterAdminReject(email:string):Promise<UserResponse>;
}