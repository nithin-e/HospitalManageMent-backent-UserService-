const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phoneNumber: String,
  licenseNumber: String,
  medicalLicenseNumber: String,
  specialty: String,
  qualifications: String,
  agreeTerms: Boolean,
  profileImageUrl: String, // Separate field for profile image
  medicalLicenseUrl: String, // Separate field for medical license
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export const DoctorDb  = mongoose.model("Doctor", doctorSchema);
