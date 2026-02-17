import { useKeycloak } from '@react-keycloak/web';

const Home = () => {
    const { keycloak } = useKeycloak();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Pemda SSO App</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                This is a demonstration application using React + TypeScript integrated with Keycloak for Single Sign-On (SSO).
            </p>

            <div className="space-y-4">
                {!keycloak.authenticated ? (
                    <button
                        onClick={() => keycloak.login()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition shadow-lg"
                    >
                        Login to Access Dashboard
                    </button>
                ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Welcome back!</strong>
                        <span className="block sm:inline"> You are currently logged in. Go to your <a href="/dashboard" className="underline">Dashboard</a>.</span>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-4xl">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
                    <p className="text-gray-600">Powered by Keycloak OpenID Connect.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">Token Management</h3>
                    <p className="text-gray-600">Automatic token refresh and expiry handling.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">User Profile</h3>
                    <p className="text-gray-600">Access and manage your account details easily.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
