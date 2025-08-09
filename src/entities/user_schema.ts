import mongoose, { Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  googleId?: string;
  role: "user" | "admin" | "doctor";
  isActive: boolean;
  createdAt: Date;
  id:string;
}

const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phoneNumber: { type: String },
  googleId: { type: String, default: '' },
  role: { 
    type: String, 
    default: 'user',
    enum: ['user', 'admin', 'doctor'] 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<User>("User", userSchema);
