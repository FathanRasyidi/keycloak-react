import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react';

const TokenInfo = () => {
    const { keycloak } = useKeycloak();
    const [expiryCountdown, setExpiryCountdown] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (keycloak.tokenParsed?.exp) {
                const now = Math.floor(Date.now() / 1000);
                const remaining = keycloak.tokenParsed.exp - now;
                setExpiryCountdown(remaining > 0 ? remaining : 0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [keycloak.tokenParsed]);

    const handleRefreshToken = () => {
        keycloak.updateToken(9999).then((refreshed) => {
            if (refreshed) {
                alert('Token Refreshed');
            } else {
                alert('Token is still valid');
            }
        }).catch(() => {
            alert('Failed to refresh token');
        });
    };

    return (
        <section className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_#00000005] p-6 mt-6 flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-graygray-700 text-lg mb-1">Token Management</h2>
                    <p className="font-normal text-graygray-400 text-sm">
                        Monitor and manage your authentication tokens.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className="text-graygray-400 text-[10px] font-bold uppercase block">Expires In</span>
                        <span className={`text-lg font-bold ${expiryCountdown < 60 ? 'text-red-500' : 'text-[#42bda9]'}`}>
                            {expiryCountdown}s
                        </span>
                    </div>
                    <button
                        onClick={handleRefreshToken}
                        className="flex items-center gap-1 text-[#42bda9] hover:text-[#0f6486] text-xs font-bold transition-colors border border-[#42bda9]/30 px-4 py-2 rounded-xl hover:bg-[#42bda9]/5"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Refresh Token
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                <div className="border border-gray-100 rounded-[15px] p-4">
                    <h3 className="font-bold text-graygray-700 text-xs mb-2">Access Token</h3>
                    <p className="font-mono bg-gray-50 p-3 rounded-xl text-xs text-graygray-500 break-all">
                        {keycloak.token}
                    </p>
                </div>

                <div className="border border-gray-100 rounded-[15px] p-4">
                    <h3 className="font-bold text-graygray-700 text-xs mb-2">Refresh Token</h3>
                    <p className="font-mono bg-gray-50 p-3 rounded-xl text-xs text-graygray-500 break-all">
                        {keycloak.refreshToken}
                    </p>
                </div>

                <div className="border border-gray-100 rounded-[15px] p-4">
                    <h3 className="font-bold text-graygray-700 text-xs mb-2">Decoded Token Payload</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto max-h-60 text-[10px] custom-scrollbar">
                        {JSON.stringify(keycloak.tokenParsed, null, 2)}
                    </pre>
                </div>
            </div>
        </section>
    );
};

export default TokenInfo;
