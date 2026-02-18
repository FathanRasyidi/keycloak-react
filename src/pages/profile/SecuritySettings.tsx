import { useEffect, useState } from 'react';
import { UserSecurityService } from '../../services/UserSecurityService.ts';
import type { CredentialGroup } from '../../services/UserSecurityService.ts';
import keycloak from '../../auth/keycloak';

const SecuritySettings = () => {
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

    const getCredentialFromGroup = (type: string) => {
        const group = credentialGroups.find((g) => g.type === type);
        return group?.userCredentialMetadatas?.[0]?.credential;
    };

    const passwordCred = getCredentialFromGroup('password');
    const otpCred = getCredentialFromGroup('otp');

    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const day = String(date.getDate()).padStart(2, '0');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year} at ${hours}:${minutes} ${ampm}`;
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
        } catch {
            alert('Failed to remove 2FA');
        }
    };

    if (loading) {
        return (
            <section className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_#00000005] p-6 mt-6">
                <p className="text-graygray-400 text-sm text-center py-4">Loading security settings...</p>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_#00000005] p-6 flex flex-col gap-4 mt-6">
            <header>
                <h2 className="font-bold text-graygray-700 text-lg mb-1">Account Security</h2>
                <p className="font-normal text-graygray-400 text-sm">
                    Manage your password and two-factor authentication settings.
                </p>
            </header>

            {/* Password Section */}
            <div className="border border-gray-100 rounded-[15px] p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-[#42bda9]/10 text-[#42bda9]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-graygray-700 text-sm">Password</h3>
                            {passwordCred ? (
                                <p className="text-graygray-400 text-xs mt-0.5">
                                    Last Updated: {formatDate(passwordCred.createdDate)}
                                </p>
                            ) : (
                                <p className="text-graygray-400 text-xs mt-0.5">No password set.</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleUpdatePassword}
                        className="flex items-center gap-1 text-[#42bda9] hover:text-[#0f6486] text-xs font-bold transition-colors border border-[#42bda9]/30 px-4 py-2 rounded-xl hover:bg-[#42bda9]/5"
                    >
                        Update Password
                    </button>
                </div>
            </div>

            {/* 2FA Section */}
            <div className="border border-gray-100 rounded-[15px] p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-[#42bda9]/10 text-[#42bda9]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-graygray-700 text-sm">Two-Factor Authentication</h3>
                            {otpCred ? (
                                <p className="text-graygray-400 text-xs mt-0.5">
                                    Last Configured: {formatDate(otpCred.createdDate)}
                                </p>
                            ) : (
                                <p className="text-red-600 text-xs mt-0.5">Not configured.</p>
                            )}
                        </div>
                    </div>
                    {otpCred ? (
                        <button
                            onClick={() => handleRemove2FA(otpCred.id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold transition-colors border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50"
                        >
                            Remove 2FA
                        </button>
                    ) : (
                        <button
                            onClick={handleSetup2FA}
                            className="flex items-center gap-1 text-[#42bda9] hover:text-[#0f6486] text-xs font-bold transition-colors border border-[#42bda9]/30 px-4 py-2 rounded-xl hover:bg-[#42bda9]/5"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Set up Authenticator
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SecuritySettings;
