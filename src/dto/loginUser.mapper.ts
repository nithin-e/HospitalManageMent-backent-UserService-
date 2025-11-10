import { UserResponse } from '@/entities/user_interface';
import { UserData, LoginUserResponse } from '@/types';

export class LoginUserMapper {
    static toUserData(response: UserResponse): UserData {
        return {
            id: response._id?.toString() || '',
            email: response.email || '',
            name: response.name || '',
            role: response.role || 'user',
            phone_number: response.phoneNumber || '',
            google_id: response.googleId || '',
            created_at:
                response.createdAt?.toISOString() || new Date().toISOString(),
            version: response.__v || 0,
            isActive: response.isActive ?? true,
        };
    }

    static toLoginResponse(
        user: UserResponse,
        accessToken: string,
        refreshToken: string
    ): LoginUserResponse {
        return {
            user: this.toUserData(user),
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    static toErrorResponse(message: string): LoginUserResponse {
        return {
            message,
        };
    }
}
