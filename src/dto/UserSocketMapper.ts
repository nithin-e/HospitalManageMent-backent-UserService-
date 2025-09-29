export interface UserEntity {
    id: string;
    name: string;
    email: string;
    password?: string;
    phone_number?: string;
    role: string;
    isActive: boolean;
    createdAt?: string;
}

export class UserSocketMapper {
    constructor(private readonly user: UserEntity) {}

    toGrpcResponse() {
        return {
            user: {
                id: this.user.id,
                name: this.user.name,
                email: this.user.email,
                isActive: this.user.isActive,
                role: this.user.role,
                createdAt: this.user.createdAt || '',
            },
        };
    }
}
