export interface IUserBlockAndUnblockServiceRepo {
    blocking_User(userId:string):Promise<boolean>;
    unBlocking_User(userId:string):Promise<boolean>;
    blockingDoctor(email:string):Promise<boolean>;
}
