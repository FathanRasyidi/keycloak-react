import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { UserSecurityService } from '../../services/UserSecurityService.ts';
import type { Session } from '../../services/UserSecurityService.ts';

const DeviceActivity = () => {
    const { keycloak } = useKeycloak();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (keycloak.authenticated) {
            loadSessions();
        }
    }, [keycloak.authenticated]);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await UserSecurityService.getSessions();
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadSessions();
        setRefreshing(false);
    };

    const handleLogoutSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to sign out this session?')) return;
        try {
            await UserSecurityService.logoutSession(sessionId);
            await loadSessions();
        } catch {
            alert('Failed to sign out session');
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
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

    return (
        <article className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_#00000005] p-6 flex flex-col gap-6">
            <header className="flex flex-col gap-1">
                <h2 className="font-bold text-graygray-700 text-lg mb-3">Account Activity</h2>
                <p className="font-normal text-graygray-400 text-sm">
                    Sign out of any unfamiliar devices.
                </p>
            </header>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-graygray-700 font-bold text-sm">Signed in devices</h3>
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
                </div>

                {loading ? (
                    <p className="text-graygray-400 text-xs text-center py-4">Loading sessions...</p>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                        {[...sessions].sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0)).map((session) => (
                            <div key={session.id} className="border border-gray-100 rounded-[15px] p-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-500">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                                            <rect x="2" y="3" width="20" height="14" rx="2" />
                                            <line x1="8" y1="21" x2="16" y2="21" />
                                            <line x1="12" y1="17" x2="12" y2="21" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                                        <span className="text-graygray-700 text-xs font-bold">{session.browser}</span>
                                        {(session.os || session.device) && (
                                            <span className="text-graygray-400 text-[10px]">
                                                {session.os} {session.device && `• ${session.device}`}
                                            </span>
                                        )}
                                        {session.current && (
                                            <span className="bg-green-50 text-green-700 text-[10px] font-medium px-1.5 py-0.5 rounded border border-green-200">
                                                Current
                                            </span>
                                        )}
                                        {!session.current && (
                                            <button
                                                onClick={() => handleLogoutSession(session.id)}
                                                className="ml-auto text-red-500 hover:text-red-700 text-[10px] font-bold transition-colors"
                                            >
                                                Sign out
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="pl-9 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-graygray-700 text-xs font-bold">IP address</span>
                                        <span className="text-graygray-500 text-xs">{session.ipAddress}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-graygray-700 text-xs font-bold">Last accessed</span>
                                        <span className="text-graygray-500 text-xs text-[#4c1d95]">
                                            {formatDate(session.lastAccess)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-graygray-700 text-xs font-bold">Clients</span>
                                        <span className="text-graygray-500 text-xs">
                                            {session.clients.map((c) => c.clientId).join(', ') || 'None'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-graygray-700 text-xs font-bold">Expires</span>
                                        <span className="text-graygray-500 text-xs">{formatDate(session.expires)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <p className="text-graygray-400 text-xs text-center py-4">No active sessions found.</p>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default DeviceActivity;
