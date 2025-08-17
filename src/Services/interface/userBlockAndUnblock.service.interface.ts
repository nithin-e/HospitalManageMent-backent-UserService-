export interface IUserBlockAndUnblockService {
    blockUser(userId: string): Promise<boolean>;
    unblockUser(userId: string): Promise<boolean>;
    blockDoctor(email: string): Promise<boolean>;
}