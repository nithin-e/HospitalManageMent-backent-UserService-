import { SignupUserEntity } from "@/types";


export class SignupUserMapper {
    constructor(private readonly rawUser: SignupUserEntity) {}

    toUserMessage() {
        return {
            id: (this.rawUser._id || this.rawUser._doc?._id)?.toString(),
            name: this.rawUser.name || this.rawUser._doc?.name || '',
            email: this.rawUser.email || this.rawUser._doc?.email || '',
            password:
                this.rawUser.password || this.rawUser._doc?.password || '',
            phoneNumber:
                this.rawUser.phoneNumber ||
                this.rawUser._doc?.phoneNumber ||
                '',
            createdAt: this.rawUser.createdAt || this.rawUser._doc?.createdAt,
            version: this.rawUser.__v || this.rawUser._doc?.__v || 0,
            googleId:
                this.rawUser.googleId || this.rawUser._doc?.googleId || '',
            role: this.rawUser.role || this.rawUser._doc?.role || '',
        };
    }
}
