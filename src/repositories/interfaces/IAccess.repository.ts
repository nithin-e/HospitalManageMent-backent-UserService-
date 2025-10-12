export interface IUserBlockAndUnblockRepository {
    blockUser(userId: string): Promise<boolean>;
    unblockUser(userId: string): Promise<boolean>;
}
