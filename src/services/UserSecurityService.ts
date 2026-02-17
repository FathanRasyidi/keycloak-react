import keycloak from '../auth/keycloak';

const getAccountUrl = () => {
    const baseUrl = keycloak.authServerUrl;
    const realm = keycloak.realm;
    const cleanBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}/realms/${realm}/account`;
};

// Types based on the actual Keycloak Account API response
export interface Credential {
    id: string;
    type: string;
    userLabel?: string;
    createdDate: number;
    secretData?: string;
    credentialData?: string;
}

export interface CredentialMetadata {
    credential: Credential;
}

export interface CredentialGroup {
    type: string;
    category: string;
    displayName: string;
    helptext: string;
    iconCssClass: string;
    userCredentialMetadatas: CredentialMetadata[];
}

export interface SessionClient {
    clientId: string;
    clientName: string;
    userConsentRequired: boolean;
    inUse: boolean;
}

export interface Session {
    id: string;
    ipAddress: string;
    started: number;
    lastAccess: number;
    expires: number;
    clients: SessionClient[];
    current: boolean;
    browser: string;
    os?: string;
    device?: string;
}

export interface LinkedAccount {
    connected: boolean; // true if linked
    social: boolean;    // true if social provider
    providerAlias: string;
    providerName: string;
    displayName?: string;
    linkedUsername?: string;
}

export const UserSecurityService = {
    // --- CREDENTIALS API ---
    getCredentials: async (): Promise<CredentialGroup[]> => {
        const url = `${getAccountUrl()}/credentials`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${keycloak.token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch credentials');
        return await response.json();
    },

    removeCredential: async (credentialId: string): Promise<void> => {
        const url = `${getAccountUrl()}/credentials/${credentialId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${keycloak.token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to remove credential');
    },

    // --- SESSIONS API ---
    getSessions: async (): Promise<Session[]> => {
        const url = `${getAccountUrl()}/sessions`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${keycloak.token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch sessions');
        return await response.json();
    },

    logoutSession: async (sessionId: string): Promise<void> => {
        const url = `${getAccountUrl()}/sessions/${sessionId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${keycloak.token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to logout session');
    },

    // --- LINKED ACCOUNTS API ---

    // Fetch list of all available identity providers and their link status
    getLinkedAccounts: async (): Promise<LinkedAccount[]> => {
        const url = `${getAccountUrl()}/linked-accounts`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${keycloak.token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch linked accounts');
        return await response.json();
    },

    // Unlink an existing identity provider
    unlinkAccount: async (providerName: string): Promise<void> => {
        const url = `${getAccountUrl()}/linked-accounts/${providerName}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to unlink account: ${response.status} ${response.statusText} - ${text}`);
        }
    }
};
