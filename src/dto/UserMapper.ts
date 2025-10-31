import { FormattedUserResponse } from '@/types';

export interface UserEntity {
    id: string;
    name: string;
    email: string;
    password?: string;
    phone_number: string;
    role: string;
    isActive: boolean;
}

export class UserMapper {
    constructor(private readonly user: UserEntity) {}

    toGrpcResponse(): FormattedUserResponse {
        return {
            user: {
                id: this.user.id,
                name: this.user.name,
                email: this.user.email,
                password: '', // always hide
                phoneNumber: this.user.phone_number,
                role: this.user.role,
                isActive: this.user.isActive,
            },
        };
    }
}
