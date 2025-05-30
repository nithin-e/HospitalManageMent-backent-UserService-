

export interface Doctor {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    licenseNumber?: string;
    medicalLicenseNumber?: string;
    specialty?: string;
    qualifications?: string;
    agreeTerms?: boolean;
    profileImageUrl?: string;
    medicalLicenseUrl: string;
    status?: 'completed' | 'proccesing'; 
    createdAt?: string;
  }


  export interface FetchAllDoctorsResponse {
    doctors: Doctor[];
  }
  


export interface IfectingAllDoctorsInterFace{
    fetchingAllDoctorData(call:any,callback:any):Promise<any>;
    fetchSingleDoctorByEmail(call:any,callback:any):Promise<any>;
}