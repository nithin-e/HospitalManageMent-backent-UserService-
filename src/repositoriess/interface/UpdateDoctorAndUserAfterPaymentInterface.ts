import { UserResponse } from "../../entities/user_interface";

export interface IUpdateDoctorAndUserAfterPaymentInterFace{
    updateDoctorAndUserAfterPayment(email:string):Promise<UserResponse>;
    DeleteDoctor_After_AdminReject(email:string):Promise<UserResponse>;
}
