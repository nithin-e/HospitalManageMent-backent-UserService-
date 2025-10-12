import { SearchDoctorResponse } from "@/types";
import { IFetchDoctorService } from "./IAll-doctors.service";
import { IApplyDoctorService } from "./IApply-doctor.service";

export interface IDoctorService  extends IApplyDoctorService, IFetchDoctorService {
        searchDoctors(
        searchQuery?: string,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        page?: number,
        limit?: number,
        role?: string
    ): Promise<SearchDoctorResponse>;
}
