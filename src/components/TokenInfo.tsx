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
        // Force update token. minValidity 9999 means if token expires in < 9999s, refresh it.
        // Basically forcing a refresh if valid.
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Token Management</h2>

            <div className="grid grid-cols-1 gap-4 text-sm break-all">
                <div>
                    <h3 className="font-semibold text-gray-600">Access Token (Truncated):</h3>
                    <p className="font-mono bg-gray-100 p-2 rounded">{keycloak.token?.substring(0, 50)}...</p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-600">Refresh Token (Truncated):</h3>
                    <p className="font-mono bg-gray-100 p-2 rounded">{keycloak.refreshToken?.substring(0, 50)}...</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div>
                        <h3 className="font-semibold text-gray-600">Expires In:</h3>
                        <p className={`text-xl font-bold ${expiryCountdown < 60 ? 'text-red-500' : 'text-green-500'}`}>
                            {expiryCountdown} seconds
                        </p>
                    </div>

                    <button
                        onClick={handleRefreshToken}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                        Manually Refresh Token
                    </button>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold text-gray-600">Decoded Token Payload:</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-60 text-xs">
                        {JSON.stringify(keycloak.tokenParsed, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TokenInfo;
