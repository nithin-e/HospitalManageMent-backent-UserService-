import { Types,Document } from 'mongoose';

export interface userData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  phone_number?:string;
  google_id?: string; // optional for normal signup
}



  export interface registration {
    
    name: string;
    email: string;
    password: string;
    phoneNumber?:string;
    phone_number?:string;
    google_id?: string;
  }


  export interface UserResponse {
    _id?: string | Types.ObjectId;  
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    createdAt?: Date;
    __v?: number;
    googleId?: string;
    message?: string;
    success?: boolean;
    error?: string;
    role?: string;
    _doc?: any; 
}



export interface DoctorFormData {
  userId?:string; 
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  specialty: string;
  qualifications: string;
  medicalLicenseNumber: string;
  agreeTerms: boolean | string;
  profileImageUrl?: string;
  medicalLicenseUrl?: string;
  documentUrls?: string[]; 
}