import { injectable } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuth.repository';
import bcrypt from '../../utility/bcrypt';
import { User } from '../../entities/user_schema';
import { BaseRepository } from './base.repository';
import type { User as UserType } from '../../entities/user_schema';
import { registration, UserResponse } from '@/entities/user_interface';
import { MESSAGES } from '@/constants/messages.constant';

@injectable()
export class AuthRepository
    extends BaseRepository<UserType>
    implements IAuthRepository
{
    constructor() {
        super(User);
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
                    message: MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED,
                };
            }

            return { success: true, message: MESSAGES.AUTH.USER_NOT_FOUND };
        } catch (error) {
            console.error('Error checking user registration:', error);
            throw new Error(MESSAGES.ERROR.REGISTER_FAILED);
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
                const duplicateError = new Error(
                    MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED
                );
                duplicateError.name = 'DuplicateEmailError';
                throw duplicateError;
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
                    error.code === 11000) ||
                    error.name === 'DuplicateEmailError')
            ) {
                throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
            }

            throw new Error(MESSAGES.ERROR.REGISTER_FAILED);
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
            console.error('Error updating user information:', error);
            throw new Error(MESSAGES.ERROR.UPDATE_INFO_FAILED);
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
            console.error('Error changing password:', error);
            throw new Error(MESSAGES.ERROR.CHANGE_PASSWORD_FAILED);
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
                return { success: false, message: MESSAGES.USER.NOT_FOUND };
            }

            if (userData.newPassword) {
                user.password = userData.newPassword;
                await user.save();
            }

            return {
                success: true,
            };
        } catch (error) {
            console.error('Error in forgot password:', error);
            throw new Error(MESSAGES.ERROR.FORGOT_PASSWORD_FAILED);
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
                return {
                    success: false,
                    message: MESSAGES.AUTH.INVALID_CREDENTIALS,
                };
            }

            const isPasswordValid = await bcrypt.matchPassword(
                userData.password || '',
                existingUser.password || ''
            );

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: MESSAGES.AUTH.INVALID_CREDENTIALS,
                };
            }

            return existingUser as UserResponse;
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw new Error(MESSAGES.ERROR.LOGIN_FAILED);
        }
    };
}
