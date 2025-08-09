import { ObjectId } from 'mongodb';


export interface ApplyDoctorRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    license_number: string;
    specialty: string;
    qualifications: string;
    medical_license_number: string;
    agree_terms: boolean;
    document_urls: string[];
    userId: string;
  }


  export interface ApplyDoctorResponse {
    success: boolean;
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    specialty: string;
    status: string;
    message: string;
  }


  export interface DoctorApplicationResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    message?: string;
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
    profileImageUrl?: string | null;  
    medicalLicenseUrl?: string | null; 
    documentUrls?: string[]; 
  }



  export interface DoctorApplicationResult {
    success: boolean;
    message: string;
    doctor?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      specialty: string;
      status: string;
      profileImageUrl?: string;
      medicalLicenseUrl?: string;
    };
  }

  export interface UpdateDoctorStatusAfterAdminApproveRequest {
    email: string;
  }
  
  export interface UpdateDoctorStatusAfterAdminApproveResponse {
    success: boolean;
  }
  



  export interface StatusUpdateResponse {
    success: boolean;
    message?: string;
  }


  export interface Doctor {
    id: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    medicalLicenseNumber: string;
    specialty: string;
    qualifications: string;
    agreeTerms?: boolean;
    profileImageUrl?: string;
    medicalLicenseUrl?: string;
    status: string;
    createdAt: string;
    isActive: boolean;
  }

  export interface DoctorsResponse {
    doctors: Doctor[];
}


  export interface SingleDoctorResponse {
    doctor: Doctor;
  }


  export interface RepositoryDoctorsResponse {
    success?: boolean;
    data: Doctor[];
    message?: string;
  }

  
  


  export interface RepositorySingleDoctorResponsee {
    success?: boolean;
    doctor: Doctor | null;  
    message?: string;
  }


  export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    googleId?: string;
    role?: 'user' | 'admin' | 'doctor';
    isActive: boolean;
    createdAt: Date;
    password?:string
}
  export interface SingleDoctorRequest {
    email: string;
  }

  export interface UserServiceResponse {
    success?: boolean;
    data?: User | User[];
    message?: string;
}

export interface SearchParams {
    searchQuery: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    role: 'user' | 'admin' | 'doctor';
    page: number;
    limit: number;
}



export interface ApplyDoctorRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  license_number: string;
  specialty: string;
  qualifications: string;
  medical_license_number: string;
  agree_terms: boolean;
  document_urls: string[];
  userId: string;
}

export interface ApplyDoctorResponse {
  success: boolean;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialty: string;
  status: string;
  message: string;
}

export interface DoctorApplicationResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  message?: string;
}

export interface DoctorFormData {
  userId?: string; 
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  specialty: string;
  qualifications: string;
  medicalLicenseNumber: string;
  agreeTerms: boolean | string;
  profileImageUrl?: string | null;  
  medicalLicenseUrl?: string | null; 
  documentUrls?: string[]; 
}

export interface DoctorApplicationResult {
  success: boolean;
  message: string;
  doctor?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      specialty: string;
      status: string;
      profileImageUrl?: string;
      medicalLicenseUrl?: string;
  };
}

export interface UpdateDoctorStatusAfterAdminApproveRequest {
  email: string;
}

export interface UpdateDoctorStatusAfterAdminApproveResponse {
  success: boolean;
}

export interface StatusUpdateResponse {
  success: boolean;
  message?: string;
}

// export interface Doctor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   licenseNumber: string;
//   medicalLicenseNumber: string;
//   specialty: string;
//   qualifications: string;
//   agreeTerms: boolean;
//   profileImageUrl?: string;
//   medicalLicenseUrl?: string;
//   status: string;
//   createdAt: string;
//   isActive: boolean;
// }

export interface DoctorsResponse {
  doctors: Doctor[];
}

export interface SingleDoctorResponse {
  data: Doctor;
}

export interface RepositoryDoctorsResponse {
  success?: boolean;
  data: Doctor[];
  message?: string;
}

export interface RepositorySingleDoctorResponse {
  success?: boolean;
  doctor: Doctor | null;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  googleId?: string;
  role?: 'user' | 'admin' | 'doctor';
  isActive: boolean;
  createdAt: Date;
}

export interface SingleDoctorRequest {
  email: string;
}

export interface UserServiceResponse {
  success?: boolean;
  data?: User | User[];
  message?: string;
}

export interface SearchParams {
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  role: 'user' | 'admin' | 'doctor';
  page: number;
  limit: number;
}


// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  googleId?: string;
  role?: 'user' | 'admin' | 'doctor';
  isActive: boolean;
  createdAt: Date;
}

export interface UserServiceResponse {
  success?: boolean;
  data?: User | User[];
  message?: string;
}

export interface SearchParams {
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  role: 'user'|'doctor'|'admin'; // Changed from union type to string for more flexibility
  page: number;
  limit: number;
}

// Doctor Application Types
export interface ApplyDoctorRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  license_number: string;
  specialty: string;
  qualifications: string;
  medical_license_number: string;
  agree_terms: boolean;
  document_urls: string[];
  userId: string;
}

export interface ApplyDoctorResponse {
  success: boolean;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialty: string;
  status: string;
  message: string;
}

export interface DoctorApplicationResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  message?: string;
}

export interface DoctorFormData {
  userId?: string; 
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  specialty: string;
  qualifications: string;
  medicalLicenseNumber: string;
  agreeTerms: boolean | string;
  profileImageUrl?: string | null;  
  medicalLicenseUrl?: string | null; 
  documentUrls?: string[]; 
}

export interface DoctorApplicationResult {
  success: boolean;
  message: string;
  doctor?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      specialty: string;
      status: string;
      profileImageUrl?: string;
      medicalLicenseUrl?: string;
  };
}

// Doctor Management Types
export interface UpdateDoctorStatusAfterAdminApproveRequest {
  email: string;
}

export interface UpdateDoctorStatusAfterAdminApproveResponse {
  success: boolean;
}

export interface StatusUpdateResponse {
  success: boolean;
  message?: string;
}

// export interface Doctor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   licenseNumber: string;
//   medicalLicenseNumber: string;
//   specialty: string;
//   qualifications: string;
//   agreeTerms: boolean;
//   profileImageUrl?: string;
//   medicalLicenseUrl?: string;
//   status: string;
//   createdAt: string;
//   isActive: boolean;
// }

export interface DoctorsResponse {
  doctors: Doctor[];
}

export interface SingleDoctorResponse {
  data: Doctor;
}

export interface RepositoryDoctorsResponse {
  success?: boolean;
  data: Doctor[];
  message?: string;
}

export interface RepositorySingleDoctorResponse {
  success?: boolean;
  data: Doctor | null;
  message?: string;
}

export interface SingleDoctorRequest {
  email: string;
}


// ===== USER AND AUTHENTICATION TYPES =====
export interface User {
  _id: any; // MongoDB ObjectId
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  googleId?: string;
  role?: 'user' | 'admin' | 'doctor';
  isActive: boolean;
  createdAt: Date;
}

export interface UserServiceResponse {
  success?: boolean;
  data?: User | User[];
  message?: string;
}

export interface SearchParams {
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  role: 'admin'|'user'|'doctor'; 
  page: number;
  limit: number;
}

// ===== DOCTOR APPLICATION TYPES =====
export interface ApplyDoctorRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  license_number: string;
  specialty: string;
  qualifications: string;
  medical_license_number: string;
  agree_terms: boolean;
  document_urls: string[];
  userId: string;
}

export interface ApplyDoctorResponse {
  success: boolean;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialty: string;
  status: string;
  message: string;
}

export interface DoctorApplicationResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  message?: string;
}

export interface DoctorFormData {
  userId?: string; 
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  specialty: string;
  qualifications: string;
  medicalLicenseNumber: string;
  agreeTerms: boolean | string;
  profileImageUrl?: string | null;  
  medicalLicenseUrl?: string | null; 
  documentUrls?: string[]; 
}

export interface DoctorApplicationResult {
  success: boolean;
  message: string;
  doctor?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      specialty: string;
      status: string;
      profileImageUrl?: string;
      medicalLicenseUrl?: string;
  };
}

// ===== DOCTOR MANAGEMENT TYPES =====
export interface UpdateDoctorStatusAfterAdminApproveRequest {
  email: string;
}

export interface UpdateDoctorStatusAfterAdminApproveResponse {
  success: boolean;
}

export interface StatusUpdateResponse {
  success: boolean;
  message?: string;
}

// export interface Doctor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   licenseNumber: string;
//   medicalLicenseNumber: string;
//   specialty: string;
//   qualifications: string;
//   agreeTerms: boolean;
//   profileImageUrl?: string;
//   medicalLicenseUrl?: string;
//   status: string;
//   createdAt: string;
//   isActive: boolean;
// }

export interface DoctorsResponse {
  doctors: Doctor[];
}

export interface SingleDoctorResponse {
  data: Doctor;
}

export interface RepositoryDoctorsResponse {
  success?: boolean;
  data: Doctor[];
  message?: string;
}

export interface RepositorySingleDoctorResponse {
  success?: boolean;
  data: Doctor | null;
  message?: string;
}

export interface SingleDoctorRequest {
  email: string;
}





// shared/types.ts
export interface FormattedUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  googleId: string;
  role: string;
  id: string;
  isActive: boolean;
}

export interface FormattedResponse {
  users: FormattedUser[];
}

export interface RepositoryUserResponse {
  users: User[];
}




// Types based on your proto file
export interface LoginUserRequest {
  email: string;
  password: string;
  google_id?: string;
  name?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone_number: string;
  created_at: string;
  google_id?: string;
  role: string;
  isActive: boolean;
}


// Service response type (what your service layer returns)
export interface LoginServiceResponse {
  user?: UserData;
  access_token?: any;
  refresh_token?: any;
  message?: string;
}


export interface GrpcCall<T = any> {
  request: T;
  metadata?: any;
  cancelled?: boolean;
}

export interface GrpcCallback<T = any> {
  (error: GrpcError | null, response?: T): void;
}

export interface GrpcError {
  code: number;
  message: string;
  details?: string;
}


export interface LoginUserRequest {
  email: string;
  password: string;
  google_id?: string;
  name?: string;
}



export interface UserData {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone_number: string;
  created_at: string;
  version: number;
  google_id?: string;
  role: string;
  isActive: boolean;
}

export interface LoginUserResponse {
  user?: UserData;
  access_token?: string;
  refresh_token?: string;
  message?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
  name?: string;
}

