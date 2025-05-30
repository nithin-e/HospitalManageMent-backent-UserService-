

export interface IapplyDoctorController{
    applyForDoctor(call:any,callback:any):Promise<void>;
    UpdateDoctorStatusAfterAdminApprove(call:any,callback:any):Promise<void>;
}
