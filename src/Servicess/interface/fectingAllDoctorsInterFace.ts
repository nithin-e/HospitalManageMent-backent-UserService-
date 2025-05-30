
interface returnData{
    name:string,
}
export interface IfectingAllDoctorsService{
    fectingDoctor_Data(call:any,callback:any):Promise<any>;
    fetchSingleDoctorByEmail(call:any,callback:any):Promise<any>;
}