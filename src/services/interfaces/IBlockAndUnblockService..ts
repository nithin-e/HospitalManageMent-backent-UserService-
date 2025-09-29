export interface IUserBlockAndUnblockService {
    blockUser(userId: string): Promise<boolean>;
    unblockUser(userId: string): Promise<boolean>;
}
