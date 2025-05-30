import {User} from "../../entities/user_schema";
import { DoctorDb } from "../../entities/doctor_schema";
import { IUpdateDoctorAndUserAfterPaymentInterFace } from "../interface/UpdateDoctorAndUserAfterPaymentInterface";


export default class UpdateDoctorAndUserAfterPaymentRepository implements IUpdateDoctorAndUserAfterPaymentInterFace {

  updateDoctorAndUserAfterPayment = async (email: string) => {
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


  DeleteDoctor_After_AdminReject = async (email: string) => {
    try {
      console.log('Processing payment update for email inside repo:', email);

      const doctorResult = await DoctorDb.findOneAndDelete({ email });

      return { success: true };
    } catch (error) {
      console.error("Error updating doctor and user after payment:", error);
      throw error;
    }
  };

}