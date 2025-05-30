
export interface IapplyDoctorService{
    apply_For_doctor(call:any,callback:any):Promise<void>;
    UpdateDctorStatus__AfterAdminApprove(call:any,callback:any):Promise<void>;
}