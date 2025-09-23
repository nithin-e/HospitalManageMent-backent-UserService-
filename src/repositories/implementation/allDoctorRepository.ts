import { DoctorDb } from "../../entities/doctor_schema";
import { IDoctorRepository } from "../interface/IAllDoctorsRepository";
import {
  RepositoryDoctorsResponse,
  RepositorySingleDoctorResponsee,
} from "../../interfaces/types";

export default class FetchAllDoctorRepository implements IDoctorRepository {
  async getAllDoctors(): Promise<RepositoryDoctorsResponse> {
    try {
      const doctors = await DoctorDb.find();
      return {
        success: true,
        data: doctors,
        message: "Doctors fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  }

  async getDoctorByEmail(
    email: string
  ): Promise<RepositorySingleDoctorResponsee> {
    try {
      console.log("repo before res", email);
      const doctor = await DoctorDb.findOne({ email: email });
      console.log("repo after res", doctor);

      return {
        success: true,
        doctor: doctor,
        message: doctor ? "Doctor found successfully" : "Doctor not found",
      };
    } catch (error) {
      console.error("Error fetching doctor in repository:", error);
      throw error;
    }
  }
}
