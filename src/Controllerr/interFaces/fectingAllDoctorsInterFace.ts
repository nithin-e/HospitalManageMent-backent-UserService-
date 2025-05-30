

export interface IfectingAllDoctorsController{
    fetchAllDoctors(call:any,callback:any):Promise<any>;
    fetchingSingleDoctor(call:any,callback:any):Promise<void>;
}