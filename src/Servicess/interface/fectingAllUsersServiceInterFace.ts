export interface IfectingAllUsersService {
    fecting_Data(): Promise<any>;
    fecting_SingleUser(email: string): Promise<any>;
    searchUserDebounce(
        searchQuery?: string,
        sortBy?: string,
        sortDirection?: string,
        role?: string,
        page?: number,
        limit?: number
    ): Promise<any>;
    fecthingUserDetails__ThroughSocket(patientId: string):Promise<any>;
}