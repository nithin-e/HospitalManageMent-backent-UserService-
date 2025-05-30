import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export const User = mongoose.model("User", userSchema);