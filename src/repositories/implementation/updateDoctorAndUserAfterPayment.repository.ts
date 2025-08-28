import {User} from "../../entities/user_schema";
import { DoctorDb } from "../../entities/doctor_schema";
import { IDoctorPaymentRepository } from "../interface/updateDoctorAndUserAfterPayment.interface";
import { UserResponse } from "../../entities/user_interface";


export default class DoctorPaymentRepository  implements IDoctorPaymentRepository {

  handleStripeWebhookUpdateUser = async (email: string):Promise<UserResponse> => {
    try {
      console.log('Processing payment update for email inside repo:', email);

      const updateRole = await User.findOneAndUpdate(
        { email },
        { $set: { role: "doctor" } },
        { new: true }
      );

      const updateDoctor = await DoctorDb.findOneAndUpdate(
        { email },
        { $set: { status: "completed" } },
        { new: true }
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating doctor and user after payment:", error);
      throw error;
    }
  };


  deleteDoctorAfterAdminReject = async (email: string):Promise<UserResponse> => {
    try {
      

       await DoctorDb.findOneAndDelete({ email });

      return { success: true };
    } catch (error) {
      console.error("Error updating doctor and user after payment:", error);
      throw error;
    }
  };

}