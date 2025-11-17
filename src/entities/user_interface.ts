import { Types, Document } from 'mongoose';

export interface userData {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    phone_number?: string;
    google_id?: string; // optional for normal signup
}

export interface registration {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    phone_number?: string;
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
    isActive?: boolean;
}

export interface UserResponsee {
    _id?: string | Types.ObjectId;
    name: string;
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

export interface UpdateUserData {
    email: string;
    newPassword?: string;
    phoneNumber: string;
    name: string; 
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
    profileImageUrl?: string;
    medicalLicenseUrl?: string;
    documentUrls?: string[];
}

export type LoginSuccessResponse = {
    success: true;
    message: string;
    data: {
        user: UserResponse;
        accessToken: string;
        refreshToken: string;
    };
};

// Error response type
export type LoginErrorResponse = {
    success: false;
    message: string;
    error?: string;
};

// // Union type for all possible login responses
// export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export interface LoginResponse {
    user: {
        _id: string;
        name: string;
        email: string;
        password?: string;
        phoneNumber: string;
        googleId: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
    };
    accessToken: string;
    refreshToken: string;
    success: boolean;
    message?: string;
}

export interface LoginUserResponse {
    message?: string;
    user?: UserResponse;
    access_token?: string;
    refresh_token?: string;
}

export interface checkResponse {}

export interface signupResponse {
    user: UserResponse;
    // accessToken: string;
    // refreshToken: string;
}

// export interface WebhookEventData {
//     type: string;
//     data: {
//         object: {
//             metadata?: {
//                 email?: string;
//                 transactionId?: string;
//             };
//             [key: string]: any;
//         };
//     };
// }


export interface WebhookEventData {
  type: string;
  data: {
    object: {
      metadata?: {
        [key: string]: string | undefined; 
      };
      [key: string]: any;
    };
  };
}


export interface WebhookResponse {
    success: boolean;
    message: string;
}
export interface SearchParams {
    searchQuery: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';  
    role: string;
    page: number;
    limit: number;
    status: string;  // ✅ Added status
}

export interface StatusUpdateResponse {
    success: boolean;
    message?: string;
    error?: string;
}
