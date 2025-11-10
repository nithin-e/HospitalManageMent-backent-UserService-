import { UserResponse } from '@/entities/user_interface';
import { SignupUserData, SignupResponse } from '@/types';

export class SignupUserMapper {
    static toSignupUserData(rawUser: UserResponse): SignupUserData {
        const user = rawUser._doc || rawUser;

        return {
            id: user._id?.toString() || '',
            name: user.name || '',
            email: user.email || '',
            phone_number: user.phoneNumber || '',
            created_at: user.createdAt
                ? new Date(user.createdAt).toISOString()
                : new Date().toISOString(),
            version: user.__v || 0,
            google_id: user.googleId || '',
            role: user.role || 'user',
        };
    }

    static toSignupResponse(user: UserResponse, message?: string): SignupResponse {
        return {
            user: this.toSignupUserData(user),
            message,
        };
    }
}
