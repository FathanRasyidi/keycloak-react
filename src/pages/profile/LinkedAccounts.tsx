import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { UserSecurityService } from '../../services/UserSecurityService';
import type { LinkedAccount } from '../../services/UserSecurityService';
import { FaLink, FaUnlink, FaGoogle, FaGithub, FaFacebook, FaMicrosoft } from 'react-icons/fa';

const LinkedAccounts = () => {
    const { keycloak } = useKeycloak();
    const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleUnlink = async (providerName: string) => {
        if (!confirm(`Apakah Anda yakin ingin memutuskan hubungan dengan ${providerName}?`)) return;

        try {
            await UserSecurityService.unlinkAccount(providerName);
            await loadAccounts(); // Refresh list after unlink
        } catch (err: any) {
            console.error(err);
            alert(`Gagal unlink account: ${err.message || 'Unknown error'}`);
        }
    };

    const handleLink = (providerAlias: string) => {
        // AIA: Application Initiated Action
        // We prompt Keycloak to execute the "idp_link" action for the specific provider
        const redirectUri = window.location.href;

        // Note: 'action' parameter is standard in keycloak-js login options (mapped to kc_action)
        // We use 'idp_link' action, potentially passing provider if supported by your keycloak version/config
        // Usually, just 'login' with idpHint is enough if "First Broker Login" is configured to "Link Existing Account"
        // But user requested 'idp_link:{provider}' syntax specifically.

        keycloak.login({
            // @ts-ignore - 'action' type might just be string enum in some typings
            action: `idp_link:${providerAlias}`,
            redirectUri: redirectUri
        });
    };

    const getProviderIcon = (alias: string) => {
        const lower = alias.toLowerCase();
        if (lower.includes('google')) return <FaGoogle className="text-red-500" />;
        if (lower.includes('github')) return <FaGithub className="text-gray-800 dark:text-white" />;
        if (lower.includes('facebook')) return <FaFacebook className="text-blue-600" />;
        if (lower.includes('microsoft')) return <FaMicrosoft className="text-blue-500" />;
        return <FaLink className="text-gray-400" />;
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Memuat data akun...</div>;
    if (error) return <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">{error}</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Linked Accounts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Hubungkan akun sosial Anda untuk login lebih cepat dan aman.
            </p>

            <div className="space-y-4">
                {accounts.map((account) => (
                    <div key={account.providerName} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">
                                {getProviderIcon(account.providerAlias)}
                            </div>

                            <div>
                                <h4 className="font-semibold capitalize text-gray-900 dark:text-white">
                                    {account.displayName || account.providerAlias}
                                </h4>
                                <div className="text-xs mt-1">
                                    {account.connected ? (
                                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            Terhubung {account.linkedUsername ? `sebagai ${account.linkedUsername}` : ''}
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                            Belum Terhubung
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {account.connected ? (
                            <button
                                onClick={() => handleUnlink(account.providerName)}
                                className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
                            >
                                <FaUnlink /> Unlink
                            </button>
                        ) : (
                            <button
                                onClick={() => handleLink(account.providerAlias)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                <FaLink /> Link Account
                            </button>
                        )}
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500">Tidak ada provider identitas yang tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkedAccounts;
