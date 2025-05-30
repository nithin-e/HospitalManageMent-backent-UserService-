import {DoctorDb} from '../../entities/doctor_schema'
import  {IfectingAllDoctorsInterFace}  from '../interface/fectingAllDoctorsInterFace';



export default class FetchAllDoctorRepository implements IfectingAllDoctorsInterFace{
    
  
    fetchingAllDoctorData = async () => {
      try {
       
        const doctors = await DoctorDb.find({});
        
        return {
          data: doctors
        }

      } catch (error) {
        console.error("Error fetching all users:", error);
        console.error("Login error in repo:", error);
        throw error;
      }
    };

    fetchSingleDoctorByEmail = async (email: string) => {
      try {

        console.log('repo before res',email);
        const doctor = await DoctorDb.findOne({ email: email });
        
        console.log('repo after res',doctor);

        return {
          data: doctor
        };

      } catch (error) {
        console.error("Error fetching doctor in repository:", error);
        throw error;
      }
    };

  }