import { LoginResponse, LoginUserResponse } from '@/entities/user_interface';

export class LoginUserMapper {
    constructor(private readonly response: LoginResponse) {}

    toGrpcResponse(): LoginUserResponse {
        if (
            !this.response.success ||
            this.response.message === 'Invalid credentials'
        ) {
            return {
                message: this.response.message || 'Login failed',
            };
        }

        return {
            user: {
                _id: this.response.user._id,
                email: this.response.user.email,
                name: this.response.user.name || '',
                role: this.response.user.role,
                phoneNumber: this.response.user.phoneNumber || '',
                googleId: this.response.user.googleId || '',
                createdAt: this.response.user.createdAt || new Date(),
                isActive: this.response.user.isActive,
            },
            access_token: this.response.accessToken,
            refresh_token: this.response.refreshToken,
        };
    }
}
