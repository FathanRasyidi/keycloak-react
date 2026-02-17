import React, { useEffect, useState } from 'react';
import { UserProfileService } from '../services/UserProfileService.ts';
import type { UserProfile } from '../services/UserProfileService.ts';
import { useKeycloak } from '@react-keycloak/web';
import SecuritySettings from './profile/SecuritySettings.tsx';
import DeviceActivity from './profile/DeviceActivity.tsx';
import LinkedAccounts from './profile/LinkedAccounts.tsx';

const Profile = () => {
    const { keycloak } = useKeycloak();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'device' | 'linked'>('profile');

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
            // Don't set global error here to allow other tabs to work
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
            email
        };

        try {
            await UserProfileService.updateUserProfile(updatedProfile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            await loadProfile();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Check console for details.' });
            console.error(error);
        }
    };

    if (loading && !profile) return <div className="p-8 text-center">Loading profile...</div>;

    const tabs = [
        { id: 'profile', label: 'Personal Info' },
        { id: 'security', label: 'Account Security' },
        { id: 'device', label: 'Device Activity' },
        { id: 'linked', label: 'Linked Accounts' },
    ] as const;

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md min-h-[600px]">
            <h1 className="text-3xl font-bold mb-6">Account Management</h1>

            {message && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Tabs Header */}
            <div className="flex border-b mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === tab.id
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'profile' && profile && (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Username cannot be changed.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-lg"
                            >
                                Save Personal Info
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'security' && (
                    <SecuritySettings />
                )}

                {activeTab === 'device' && (
                    <DeviceActivity />
                )}

                {activeTab === 'linked' && (
                    <LinkedAccounts />
                )}
            </div>
        </div>
    );
};

export default Profile;
