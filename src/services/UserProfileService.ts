import keycloak from '../auth/keycloak';

const getAccountUrl = () => {
    // Determine the base URL for Keycloak Account API
    // If keycloak.authServerUrl is "http://localhost:8080/", realm is "PemdaSSO"
    // The account API is usually at /realms/{realm}/account
    const baseUrl = keycloak.authServerUrl;
    const realm = keycloak.realm;

    // Ensure no double slashes if authServerUrl ends with /
    const cleanBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}/realms/${realm}/account`;
};

export interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    attributes: Record<string, string[]>;
}

export const UserProfileService = {
    getUserProfile: async (): Promise<UserProfile> => {
        try {
            const url = getAccountUrl();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    updateUserProfile: async (profile: Partial<UserProfile>): Promise<void> => {
        try {
            const url = getAccountUrl();
            const response = await fetch(url, {
                method: 'POST', // Account API uses POST for updates in some versions, or PUT. 
                // Standard Keycloak Account Console uses a specific endpoint or form submit.
                // However, the REST API often allows POST to /account for updates if enabled.
                // Let's try standard Account REST API. 
                // NOTE: This might require specific client configuration (view-profile, manage-account roles).
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(profile)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
};
