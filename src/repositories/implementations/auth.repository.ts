import { injectable } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuth.repository';
import bcrypt from '../../utility/bcrypt';
import { User } from '../../entities/user_schema';
import { BaseRepository } from './base.repository';
import type { User as UserType } from '../../entities/user_schema';
import { registration, UserResponse } from '@/entities/user_interface';

@injectable()
export class AuthRepository
    extends BaseRepository<UserType>
    implements IAuthRepository
{

     constructor() {
        super(User)
    }

    checkUser = async (
        email: string,
        phoneNumber: string
    ): Promise<UserResponse> => {
        try {
            const CheckingUser = await User.findOne({ email });

            if (CheckingUser) {
                return {
                    success: false,
                    message: 'user already registered with this email',
                };
            }

            return { success: true, message: 'user not registered' };
        } catch (error) {
            console.log('..error occuring', error);
            throw new Error('Error checking user registration');
        }
    };

    saveUser = async (userData: registration): Promise<UserResponse> => {
        try {
            const userCount = await User.countDocuments();

            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser && userData.google_id) {
                if (!existingUser.googleId) {
                    existingUser.googleId = userData.google_id;
                    const updatedUser = await existingUser.save();

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
                phoneNumber: userData.phoneNumber || '',
                googleId: userData.google_id || '',
                role: userCount === 0 ? 'admin' : 'user',
            });

            const savedUser = await newUser.save();

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

    updateUserInformation = async (userData: {
        email: string;
        name: string;
        phoneNumber: string;
    }): Promise<UserResponse> => {
        try {
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

    changePassword = async (userData: {
        email: string;
        newPassword?: string;
    }): Promise<UserResponse> => {
        try {
            const { email } = userData;

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

    setUpForgotPassword = async (userData: {
        email: string;
        newPassword?: string;
    }): Promise<UserResponse> => {
        try {
            const { email } = userData;

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
            console.error('Error in forget password repo:', error);
            throw error;
        }
    };

    checkUserExists = async (userData: {
        email: string;
        password?: string;
        googleId?: string;
        name?: string;
        phoneNumber?: string;
    }): Promise<UserResponse> => {
        try {
            if (userData.googleId) {
                let existingUser = await this.findByEmail(userData.email);

                if (!existingUser) {
                    console.log('Creating new Google user...');
                    existingUser = await this.create({
                        email: userData.email,
                        googleId: userData.googleId,
                        password: userData.password || '',
                        name: userData.name || '',
                        phoneNumber: userData.phoneNumber || '',
                        role: 'user',
                    } as any);
                } else {
                    existingUser.googleId = userData.googleId;
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
                return { success: false, error: 'Invalid credentials' };
            }

            return existingUser as UserResponse;
        } catch (error) {
            console.error('Login error in repo:', error);
            throw error;
        }
    };
}
