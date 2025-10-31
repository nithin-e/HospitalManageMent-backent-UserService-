import bcrypt from '../../utility/bcrypt';
import { User } from '../../entities/user_schema';
import { registration, UserResponse } from '../../entities/user_interface';
import type { User as UserType } from '../../entities/user_schema';
import { BaseRepository } from './base.repository';
import { injectable } from 'inversify';
import {
    IUserRepository,
    SearchUserResponse,
} from '../interfaces/IUsers.repository';
import { RepositoryUsersResponse, SearchParams } from '@/types';

@injectable()
export class UserRepository
    extends BaseRepository<UserType>
    implements IUserRepository
{
    constructor() {
        super(User);
    }
    async getAllUsers(): Promise<RepositoryUsersResponse> {
        try {
            const users = await this.find({});
            return {
                data: users,
            };
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw new Error('Failed to fetch users');
        }
    }

    getUserByEmail = async (email: string): Promise<User> => {
        try {
            const user = await this.findOne({ email });

            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    };

    async searchUsers(params: SearchParams): Promise<SearchUserResponse> {
        try {
            const { searchQuery, sortBy, sortDirection, role, page, limit } =
                params;
            const query: Record<string, unknown> = {};

            if (searchQuery && searchQuery.trim()) {
                query.$or = [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } },
                ];
            }

            if (role && role.trim()) {
                query.role = role;
            }

            const skip = (page - 1) * limit;

            const sortObj: Record<string, 1 | -1> = {};
            if (sortBy) {
                sortObj[sortBy] = sortDirection === 'asc' ? 1 : -1;
            }

            const [users, totalCount, activeCount, blockedCount] =
                await Promise.all([
                    User.find(query)
                        .sort(sortObj)
                        .skip(skip)
                        .limit(limit)
                        .select(
                            '_id name email phoneNumber role isActive createdAt'
                        )
                        .lean(),
                    User.countDocuments(query),
                    User.countDocuments({ ...query, isActive: true }),
                    User.countDocuments({ ...query, isActive: false }),
                ]);

            const mappedUsers = users.map((user) => ({
                id: user._id.toString(),
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phoneNumber || '',
                role: user.role || 'user',
                isActive: user.isActive ?? false,
                createdAt: user.createdAt ? user.createdAt.toISOString() : '',
            }));

            return {
                users: mappedUsers,
                totalCount,
                activeCount,
                blockedCount,
            };
        } catch (error) {
            console.error('Error in debounced search repository:', error);
            throw error;
        }
    }

    getUserDetailsViaSocket = async (patientId: string) => {
        try {
            const user = await User.findById(patientId).select('-password');

            if (!user) {
                throw new Error(`User not found with ID: ${patientId}`);
            }

            return user;
        } catch (error) {
            console.error('Error fetching user from database:', error);
            throw error;
        }
    };
}
