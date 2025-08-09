export interface IUserBlockAndUnblockService{
    BlockingUser(userId:string):Promise<boolean>;
    unBlockingUser(userId:string):Promise<boolean>;
    BlockingDoctor(email:string):Promise<boolean>;
}