import { SearchDoctorResponse } from "@/types";
import { IFetchDoctorService } from "./IAllDoctorsService";
import { IApplyDoctorService } from "./IApplyDoctorService";

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
