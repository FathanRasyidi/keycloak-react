import { useKeycloak } from '@react-keycloak/web';
import TokenInfo from '../components/TokenInfo';

const Dashboard = () => {
    const { keycloak } = useKeycloak();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
                <p className="text-gray-600 mb-6">Welcome back, <span className="font-semibold text-blue-600">{keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username}</span>!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-bold mb-2">Profile Information</h3>
                        <ul className="text-sm space-y-2">
                            <li><strong>Ext ID:</strong> {keycloak.subject}</li>
                            <li><strong>Email:</strong> {keycloak.tokenParsed?.email}</li>
                            <li><strong>Username:</strong> {keycloak.tokenParsed?.preferred_username}</li>
                            <li><strong>Full Name:</strong> {keycloak.tokenParsed?.name}</li>
                        </ul>
                        <div className="mt-4">
                            <button
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                                onClick={() => keycloak.accountManagement()}
                            >
                                Edit Profile in Keycloak
                            </button>
                        </div>
                    </div>

                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-bold mb-2">Session Details</h3>
                        <ul className="text-sm space-y-2">
                            <li><strong>Session ID:</strong> {keycloak.tokenParsed?.sid}</li>
                            <li><strong>Issued At:</strong> {new Date((keycloak.tokenParsed?.iat || 0) * 1000).toLocaleString()}</li>
                            <li><strong>Auth Time:</strong> {new Date((keycloak.tokenParsed?.auth_time || 0) * 1000).toLocaleString()}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <TokenInfo />
        </div>
    );
};

export default Dashboard;
