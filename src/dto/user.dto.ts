import { User } from "../entities/user_schema";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const mapUserToDTO = (user: User): UserDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone_number: user.phoneNumber || '',
  role: user.role,
  isActive: user.isActive ?? false,
  createdAt: user.createdAt.toISOString()
});
