"use server";

class LeadsService {
    static async getDependentRepostories() {
        // Add your logic here
    }

    static async getDependentUsers(id: string) {
        // Add your logic here
    }

    static async getDependentPackages() {
        // Add your logic here
    }

    static async getDependentOwners(repoId: string) {
        // Add your logic here
        const response = await fetch(`https://radar-api.ecosyste.ms/api/v1/repositories/${repoId}/dependent_owners`);
        // if it is 404 return empty array
        if (response.status === 404) {
            return [];
        }
        return response.json();
    }

}

export default LeadsService;
export const { getDependentOwners } = LeadsService;
