import React, { useEffect, useState } from 'react';
import { UserProfileService } from '../services/UserProfileService.ts';
import type { UserProfile } from '../services/UserProfileService.ts';
import { useKeycloak } from '@react-keycloak/web';
import SecuritySettings from './profile/SecuritySettings.tsx';
import DeviceActivity from './profile/DeviceActivity.tsx';
import LinkedAccounts from './profile/LinkedAccounts.tsx';
import TokenInfo from '../components/TokenInfo.tsx';
import PageHeader from '../components/layout/PageHeader.tsx';
import Footer from '../components/layout/Footer.tsx';

const Profile = () => {
    const { keycloak } = useKeycloak();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (keycloak.authenticated) {
            loadProfile();
        }
    }, [keycloak.authenticated]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await UserProfileService.getUserProfile();
            setProfile(data);
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!profile) return;

        const updatedProfile: Partial<UserProfile> = {
            ...profile,
            firstName,
            lastName,
            email,
        };

        try {
            await UserProfileService.updateUserProfile(updatedProfile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditMode(false);
            await loadProfile();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Check console for details.' });
            console.error(error);
        }
    };

    const displayName = keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || 'User';
    const displayEmail = keycloak.tokenParsed?.email || '-';

    return (
        <div className="flex flex-col gap-0">
            {/* Page Header */}
            <PageHeader title="Account" breadcrumbs={['Pages', 'Account']} />

            {/* User Profile Summary - Glassmorphism Card */}
            <section className="relative z-10 mt-[-80px] mx-8 w-auto rounded-[20px] border border-white/60 shadow-[0px_3.5px_5.5px_#00000005] backdrop-blur-[15px] bg-[linear-gradient(113deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.6)_100%)] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-200 overflow-hidden">
                            <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg leading-tight font-bold text-graygray-700">{displayName}</h1>
                        <p className="text-sm font-normal text-graygray-500 mt-1">{displayEmail}</p>
                    </div>
                </div>

                <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-[0px_2px_5.5px_#00000005] text-[10px] font-bold text-graygray-700 hover:bg-gray-50 transition-colors uppercase tracking-[0]"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] text-graygray-700">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit personal info
                </button>
            </section>

            {/* Edit Profile Modal */}
            {editMode && profile && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setEditMode(false);
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden transform transition-all">
                        <div className="flex items-center justify-between p-6 pb-0">
                            <h2 className="font-bold text-graygray-700 text-lg">Edit Profile</h2>
                            <button
                                onClick={() => setEditMode(false)}
                                className="text-graygray-400 hover:text-graygray-700 transition-colors p-1"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={`p-3 mb-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-graygray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        disabled
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-graygray-400 mt-1">Username cannot be changed.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-graygray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#42bda9] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-graygray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#42bda9] transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-graygray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#42bda9] transition-colors"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-graygray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#42bda9] text-white rounded-xl text-sm font-bold hover:bg-[#0f6486] transition-colors shadow-md"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Settings Grid */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Profile Information */}
                <article className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_#00000005] p-6 flex flex-col h-full">
                    <header className="mb-4">
                        <h2 className="font-bold text-graygray-700 text-lg">Profile Information</h2>
                    </header>
                    <div className="flex-1 flex flex-col gap-6">
                        <p className="font-normal text-graygray-400 text-sm leading-relaxed">
                            Manage your personal information and account security settings directly from your profile dashboard.
                        </p>
                        <hr className="w-full opacity-50 border-gray-200" />
                        <dl className="flex flex-col gap-3">
                            <div className="flex gap-2 text-sm">
                                <dt className="font-bold text-graygray-700 min-w-[90px]">Full Name:</dt>
                                <dd className="text-graygray-500">
                                    {profile
                                        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '-'
                                        : loading ? 'Loading...' : '-'}
                                </dd>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <dt className="font-bold text-graygray-700 min-w-[90px]">Username:</dt>
                                <dd className="text-graygray-500">
                                    {keycloak.tokenParsed?.preferred_username || '-'}
                                </dd>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <dt className="font-bold text-graygray-700 min-w-[90px]">Email:</dt>
                                <dd className="text-graygray-500 flex items-center gap-2">
                                    <span>{keycloak.tokenParsed?.email || '-'}</span>
                                    {keycloak.tokenParsed?.email_verified && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                            Verified
                                        </span>
                                    )}
                                </dd>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <dt className="font-bold text-graygray-700 min-w-[90px]">Issuer:</dt>
                                <dd className="text-graygray-500 break-all">
                                    {keycloak.tokenParsed?.iss || '-'}
                                </dd>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <dt className="font-bold text-graygray-700 min-w-[90px]">Roles:</dt>
                                <dd className="text-graygray-500">
                                    {keycloak.tokenParsed?.realm_access?.roles?.join(', ') || '-'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </article>

                {/* Account Activity */}
                <DeviceActivity />
            </section>

            {/* Security Settings */}
            <SecuritySettings />

            {/* Linked Accounts */}
            <LinkedAccounts />

            {/* Token Management */}
            {/* <TokenInfo /> */}

            <Footer />
        </div>
    );
};

export default Profile;
