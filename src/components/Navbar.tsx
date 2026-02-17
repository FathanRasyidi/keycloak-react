import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { keycloak } = useKeycloak();

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Pemda SSO App</Link>

                <div className="space-x-4">
                    <Link to="/" className="hover:text-blue-200">Home</Link>

                    {keycloak.authenticated && (
                        <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                    )}

                    {!keycloak.authenticated && (
                        <button
                            type="button"
                            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
                            onClick={() => keycloak.login()}
                        >
                            Login
                        </button>
                    )}

                    {keycloak.authenticated && (
                        <>
                            <Link
                                to="/profile"
                                className="hover:text-blue-200"
                            >
                                My Account
                            </Link>

                            <div className="inline-block text-sm ml-4">
                                Verified User: {keycloak.tokenParsed?.preferred_username}
                            </div>

                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ml-4"
                                onClick={() => keycloak.logout()}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
