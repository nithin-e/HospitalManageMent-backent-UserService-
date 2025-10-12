export interface IAccessService {
    blockUser(userId: string): Promise<boolean>;
    unblockUser(userId: string): Promise<boolean>;
}
