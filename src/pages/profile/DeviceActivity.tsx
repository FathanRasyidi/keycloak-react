import { useEffect, useState } from 'react';
import { UserSecurityService } from '../../services/UserSecurityService.ts';
import type { Session } from '../../services/UserSecurityService.ts';

const DeviceActivity = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await UserSecurityService.getSessions();
            console.log('Sessions Data:', data); // Debugging API response
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to log out this session?')) return;
        try {
            await UserSecurityService.logoutSession(sessionId);
            await loadSessions();
        } catch (error) {
            alert('Failed to logout session');
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    if (loading) return <div>Loading sessions...</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Device Activity</h3>
            <p className="text-sm text-gray-500">Manage your active sessions.</p>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded bg-white shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-semibold text-lg flex items-center gap-2">
                                    {session.browser}
                                    {session.current && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current session</span>
                                    )}
                                </div>
                                {/* Display OS and Device if available */}
                                {(session.os || session.device) && (
                                    <div className="text-sm text-gray-600">
                                        {session.os && <span>OS: {session.os} </span>}
                                        {session.device && <span>Device: {session.device}</span>}
                                    </div>
                                )}
                            </div>

                            {!session.current && (
                                <button
                                    onClick={() => handleLogoutSession(session.id)}
                                    className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm"
                                >
                                    Sign out
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mt-2">
                            <div>
                                <span className="font-medium">IP Address:</span> {session.ipAddress}
                            </div>
                            <div>
                                <span className="font-medium">Clients:</span> {session.clients.map(c => c.clientId).join(', ') || 'None'}
                            </div>
                            <div>
                                <span className="font-medium">Started:</span> {formatDate(session.started)}
                            </div>
                            <div>
                                <span className="font-medium">Last Access:</span> {formatDate(session.lastAccess)}
                            </div>
                            <div>
                                <span className="font-medium">Expires:</span> {formatDate(session.expires)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceActivity;
