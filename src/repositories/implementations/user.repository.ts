import bcrypt from '../../utility/bcrypt';
import { User } from '../../entities/user_schema';
import { registration, UserResponse } from '../../entities/user_interface';
import type { User as UserType } from '../../entities/user_schema';
import { BaseRepository } from './base.repository';
import { injectable } from 'inversify';
import { IUserRepository, SearchUserResponse } from '../interfaces/IUsers.repository';
import {  RepositoryUsersResponse, SearchParams } from '@/types';





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
            console.log('Fetching user with email in repo:', email);

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

            // Map to strict UserDTO format
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
            console.log('Repository: Fetching user with ID:', patientId);

            const user = await User.findById(patientId).select('-password');

            if (!user) {
                throw new Error(`User not found with ID: ${patientId}`);
            }

            console.log('Repository: User found:', user);
            return user;
        } catch (error) {
            console.error('Error fetching user from database:', error);
            throw error;
        }
    };

    checkUserExists = async (userData: {
        email: string;
        password?: string;
        google_id?: string;
        name?: string;
        phoneNumber?: string;
    }): Promise<UserResponse> => {
        try {
            if (userData.google_id) {
                console.log('Google auth flow detected...');

                let existingUser = await this.findByEmail(userData.email);

                if (!existingUser) {
                    console.log('Creating new Google user...');
                    existingUser = await this.create({
                        email: userData.email,
                        googleId: userData.google_id,
                        password: userData.password || '',
                        name: userData.name || '',
                        phoneNumber: userData.phoneNumber || '',
                        role: 'user',
                    } as any);
                } else {
                    existingUser.googleId = userData.google_id;
                    await existingUser.save();
                }

                return existingUser as UserResponse;
            }

            const existingUser = await this.findByEmail(userData.email);

            if (!existingUser) {
                return { success: false, error: 'Invalid credentials' };
            }

            const isPasswordValid = await bcrypt.matchPassword(
                userData.password || '',
                existingUser.password || ''
            );

            if (!isPasswordValid) {
                console.log('ullil kerindo', isPasswordValid);

                return { success: false, error: 'Invalid credentials' };
            }

            return existingUser as UserResponse;
        } catch (error) {
            console.error('Login error in repo:', error);
            throw error;
        }
    };

    setUpForgotPassword = async (userData: {
        email: string;
        newPassword?: string;
    }): Promise<UserResponse> => {
        try {
            const { email } = userData;

            // Find user by email
            const user = await this.findOne({ email });

            console.log('are u able to find the user', user);

            if (!user) {
                return {
                    success: false,
                };
            }

            // Update password if provided
            if (userData.newPassword) {
                user.password = userData.newPassword;
                await user.save();
            }

            return {
                success: true,
            };
        } catch (error) {
            console.error('Error in forget password repo:', error);
            throw error;
        }
    };

    changePassword = async (userData: {
        email: string;
        newPassword?: string;
    }): Promise<UserResponse> => {
        try {
            console.log('Repository function called with:', userData);

            const { email } = userData;
            // Find user by email
            const user = await this.findOne({ email });

            if (!user) {
                return {
                    success: false,
                };
            }

            if (userData.newPassword) {
                user.password = userData.newPassword;
                await user.save();
            }

            return {
                success: true,
            };
        } catch (error) {
            console.error('Error in change password repository:', error);
            throw error;
        }
    };

    updateUserInformation = async (userData: {
        email: string;
        name: string;
        phoneNumber: string;
    }): Promise<UserResponse> => {
        try {
            console.log('Repository function called with:', userData);

            // Find and update user by email
            const updatedUser = await User.findOneAndUpdate(
                { email: userData.email },
                {
                    name: userData.name,
                    phone_number: userData.phoneNumber,
                },
                { new: true }
            );

            if (!updatedUser) {
                return {
                    success: false,
                };
            }

            return {
                success: true,
            };
        } catch (error) {
            console.error(
                'Error in change user information repository:',
                error
            );
            throw error;
        }
    };

    saveUser = async (userData: registration): Promise<UserResponse> => {
        try {
            const userCount = await User.countDocuments();

            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser && userData.google_id) {
                console.log(
                    'Existing user found for Google sign-in:',
                    existingUser
                );

                if (!existingUser.googleId) {
                    existingUser.googleId = userData.google_id;
                    const updatedUser = await existingUser.save();
                    console.log(
                        'Updated existing user with Google ID:',
                        updatedUser
                    );
                    return updatedUser as UserResponse;
                }

                return existingUser as UserResponse;
            }

            if (!userData.google_id && existingUser) {
                const error = new Error(
                    `User with email ${userData.email} already exists`
                );
                error.name = 'DuplicateEmailError';
                throw error;
            }

            const newUser = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password || '',
                phoneNumber: userData.phone_number || '',
                googleId: userData.google_id || '',
                role: userCount === 0 ? 'admin' : 'user',
            });

            const savedUser = await newUser.save();
            console.log('User saved into DB:', savedUser);

            return savedUser as UserResponse;
        } catch (error) {
            console.error('Error saving user:', error);

            if (
                error instanceof Error &&
                ((error.name === 'MongoServerError' &&
                    'code' in error &&
                    (error as any).code === 11000) ||
                    error.name === 'DuplicateEmailError')
            ) {
                if (userData.google_id || userData.google_id) {
                    try {
                        const existingUser = await User.findOne({
                            email: userData.email,
                        });
                        if (existingUser) {
                            console.log(
                                'Returning existing user for Google sign-in:',
                                existingUser
                            );
                            return existingUser as UserResponse;
                        }
                    } catch (findError) {
                        console.error(
                            'Error finding existing user:',
                            findError
                        );
                    }
                }

                const duplicateError = new Error(
                    `User with email ${userData.email} already exists`
                );
                duplicateError.name = 'DuplicateEmailError';
                throw duplicateError;
            }

            throw new Error((error as Error).message);
        }
    };

    checkUser = async (
        email: string,
        phoneNumber: string
    ): Promise<UserResponse> => {
        try {
            const CheckingUser = await User.findOne({ email });
            console.log('userDetailWithEmail', CheckingUser);

            if (CheckingUser) {
                return {
                    success: false,
                    message: 'user already registered with this email',
                };
            }

            console.log('inside the repo with no user');

            return { success: true, message: 'user not registered' };
        } catch (error) {
            console.log('..error aahnu mone...', error);
            throw new Error('Error checking user registration');
        }
    };


     async blockUser(userId: string): Promise<boolean> {
            try {
                const user = await this.findById(userId);
    
                if (!user) {
                    throw new Error('User not found');
                }
    
                console.log('Before update:', user.toObject());
    
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { isActive: false },
                    { new: true }
                );
    
                console.log('After update:', updatedUser?.toObject());
    
                return true;
            } catch (error) {
                console.error('Error blocking user in repository:', error);
                throw error;
            }
        }
    
        async unblockUser(userId: string): Promise<boolean> {
            try {
                const user = await this.findById(userId);
    
                if (!user) {
                    throw new Error('User not found');
                }
    
                console.log('Before update:', user.toObject());
    
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { isActive: true },
                    { new: true }
                );
    
                console.log('After update:', updatedUser?.toObject());
    
                return true;
            } catch (error) {
                console.error('Error unblocking user in repository:', error);
                throw error;
            }
        }
}
