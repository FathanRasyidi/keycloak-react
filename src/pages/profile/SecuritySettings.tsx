import { useEffect, useState } from 'react';
import { UserSecurityService } from '../../services/UserSecurityService.ts';
import type { CredentialGroup } from '../../services/UserSecurityService.ts';
import keycloak from '../../auth/keycloak';

const SecuritySettings = () => {
    // Note: State now holds groups of credentials
    const [credentialGroups, setCredentialGroups] = useState<CredentialGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        try {
            const data = await UserSecurityService.getCredentials();
            setCredentialGroups(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to extract the actual credential from a group (e.g., 'password' or 'otp')
    const getCredentialFromGroup = (type: string) => {
        const group = credentialGroups.find(g => g.type === type);
        // Usually the first metadata entry contains the user's credential
        return group?.userCredentialMetadatas?.[0]?.credential;
    };

    const passwordCred = getCredentialFromGroup('password');
    const otpCred = getCredentialFromGroup('otp');

    // Helper to safely format timestamp
    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    const handleUpdatePassword = () => {
        keycloak.login({ action: 'UPDATE_PASSWORD' });
    };

    const handleSetup2FA = () => {
        keycloak.login({ action: 'CONFIGURE_TOTP' });
    };

    const handleRemove2FA = async (id: string) => {
        if (!confirm('Are you sure you want to disable Two-Factor Authentication?')) return;
        try {
            await UserSecurityService.removeCredential(id);
            await loadCredentials();
        } catch (error) {
            alert('Failed to remove 2FA');
        }
    };

    if (loading) return <div>Loading security settings...</div>;

    return (
        <div className="space-y-8">
            {/* Password Section */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold">Basic Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded bg-white shadow-sm">
                    <div>
                        <div className="font-semibold">Password</div>
                        {passwordCred ? (
                            <div className="text-sm text-gray-500">
                                Created: {formatDate(passwordCred.createdDate)}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">No password set.</div>
                        )}
                    </div>
                    <button
                        onClick={handleUpdatePassword}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                    >
                        Update
                    </button>
                </div>
            </section>

            <hr />

            {/* 2FA Section */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded bg-white shadow-sm">
                    <div>
                        <div className="font-semibold">Authenticator Application</div>
                        {otpCred ? (
                            <div className="text-sm text-gray-500">
                                Configured on: {formatDate(otpCred.createdDate)}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Not configured.</div>
                        )}
                    </div>

                    {otpCred ? (
                        <button
                            onClick={() => handleRemove2FA(otpCred.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    ) : (
                        <button
                            onClick={handleSetup2FA}
                            className="px-4 py-2 text-blue-600 hover:underline transition"
                        >
                            Set up Authenticator application
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SecuritySettings;
