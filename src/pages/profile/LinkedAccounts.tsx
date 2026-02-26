import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { UserSecurityService } from '../../services/UserSecurityService';
import type { LinkedAccount } from '../../services/UserSecurityService';

const LinkedAccounts = () => {
    const { keycloak } = useKeycloak();
    const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (keycloak.authenticated) {
            loadAccounts();
        }
    }, [keycloak.authenticated]);

    const loadAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await UserSecurityService.getLinkedAccounts();
            setAccounts(data);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat daftar akun. Pastikan Anda sudah login.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadAccounts();
        setRefreshing(false);
    };

    const handleUnlink = async (providerName: string) => {
        if (!confirm(`Apakah Anda yakin ingin memutuskan hubungan dengan ${providerName}?`)) return;
        try {
            await UserSecurityService.unlinkAccount(providerName);
            await loadAccounts();
        } catch (err: unknown) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Gagal unlink account: ${message}`);
        }
    };

    const handleLink = (providerAlias: string) => {
        const redirectUri = window.location.href;
        keycloak.login({
            // @ts-ignore
            action: `idp_link:${providerAlias}`,
            redirectUri: redirectUri,
        });
    };

    const getProviderIcon = (alias: string) => {
        const lower = alias.toLowerCase();
        if (lower.includes('google')) {
            return (
                <svg viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
            );
        }
        if (lower.includes('facebook')) {
            return (
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#1877F2" d="M12 0C5.373 0 0 5.373 0 12c0 5.988 4.388 10.952 10.125 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.791-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.952 24 17.988 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
            );
        }
        if (lower.includes('github')) {
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-800">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            );
        }
        if (lower.includes('microsoft')) {
            return (
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
                    <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
                </svg>
            );
        }
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        );
    };

    const linkedAccounts = accounts.filter((a) => a.connected);
    const unlinkedAccounts = accounts.filter((a) => !a.connected);

    return (
        <section className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_#00000005] p-6 flex flex-col gap-4 mt-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-graygray-700 text-lg mb-1">Linked accounts</h2>
                    <p className="font-normal text-graygray-400 text-sm">
                        Manage logins through third-party accounts.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing || !keycloak.authenticated}
                    className="flex items-center gap-1 text-[#734da8] hover:text-[#4c1d95] text-xs font-bold transition-colors disabled:opacity-50"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Refresh
                </button>
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-400 text-sm">Loading accounts...</p>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {/* Linked Accounts */}
                    {linkedAccounts.length > 0 && (
                        <div className="border border-gray-100 rounded-[15px] p-5 pb-2">
                            <h3 className="font-bold text-graygray-700 text-sm mb-4">Linked login providers</h3>
                            <div className="flex flex-col divide-y divide-gray-100">
                                {linkedAccounts.map((account) => (
                                    <div
                                        key={account.providerName}
                                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                {getProviderIcon(account.providerAlias)}
                                            </div>
                                            <span className="font-bold text-sm text-graygray-700 w-20 capitalize">
                                                {account.displayName || account.providerAlias}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                                {account.social ? 'Social login' : 'Enterprise'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1 md:justify-end">
                                            {account.linkedUsername && (
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {account.linkedUsername}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handleUnlink(account.providerName)}
                                                className="flex items-center gap-1 text-[#734da8] hover:text-[#4c1d95] text-xs font-bold transition-colors"
                                            >
                                                <span className="text-lg leading-none mb-0.5">×</span> Unlink account
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unlinked Accounts */}
                    {unlinkedAccounts.length > 0 && (
                        <div className="border border-gray-100 rounded-[15px] p-5 pb-2">
                            <h3 className="font-bold text-graygray-700 text-sm mb-4">Unlinked login providers</h3>
                            <div className="flex flex-col divide-y divide-gray-100">
                                {unlinkedAccounts.map((account) => (
                                    <div
                                        key={account.providerName}
                                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                {getProviderIcon(account.providerAlias)}
                                            </div>
                                            <span className="font-bold text-sm text-graygray-700 w-20 capitalize">
                                                {account.displayName || account.providerAlias}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                                {account.social ? 'Social login' : 'Enterprise'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1 md:justify-end">
                                            <button
                                                onClick={() => handleLink(account.providerAlias)}
                                                className="flex items-center gap-1 text-[#734da8] hover:text-[#4c1d95] text-xs font-bold transition-colors"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                </svg>
                                                Link account
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {accounts.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-gray-200 rounded-[15px]">
                            <p className="text-gray-400 text-sm">Tidak ada provider identitas yang tersedia.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default LinkedAccounts;
