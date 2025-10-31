export interface IAccessRepository {
    blockUser(userId: string): Promise<boolean>;
    unblockUser(userId: string): Promise<boolean>;
}
