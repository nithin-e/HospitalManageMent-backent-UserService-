// entities/user_schema.ts
import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  phoneNumber?: string;
  role?: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: String,
    email: { type: String, required: true },
    password: String,
    googleId: String,
    phoneNumber: String,
    role: String,
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
