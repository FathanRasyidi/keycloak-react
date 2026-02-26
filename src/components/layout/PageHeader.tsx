import { useKeycloak } from '@react-keycloak/web';
import { useState } from 'react';
import LogoutModal from '../LogoutModal.tsx';

interface PageHeaderProps {
    title: string;
    breadcrumbs: string[];
}

const PageHeader = ({ title, breadcrumbs }: PageHeaderProps) => {
    const { keycloak } = useKeycloak();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleAuthAction = () => {
        if (keycloak.authenticated) {
            setShowLogoutModal(true);
        } else {
            keycloak.login();
        }
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        keycloak.logout({ redirectUri: window.location.origin + '/' });
    };

    return (
        <>
            <header className="w-full flex justify-between items-start min-h-[300px] rounded-[25px] p-6 relative overflow-hidden shadow-md">
                <span className="absolute inset-0 bg-[linear-gradient(to_top_right,#4c1d95,60%,#fbbf24)] opacity-80 z-0"></span>

                <div className="flex flex-col gap-1 relative z-10 w-full md:w-auto">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 font-normal text-sm text-white">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    {index > 0 && <span className="text-white opacity-80">/</span>}
                                    <span className={index < breadcrumbs.length - 1 ? 'text-white opacity-80' : 'text-white'}>
                                        {crumb}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <h1 className="font-bold text-white text-base">{title}</h1>
                </div>

                <nav className="flex items-center gap-4 relative z-10" aria-label="Top navigation">
                    <div className="items-center bg-white rounded-[15px] border border-solid border-white/20 px-3 py-2 w-[200px] hidden md:flex">
                        <div className="w-[15px] h-[15px] mr-2 flex items-center justify-center text-gray-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Type here..."
                            className="w-full bg-transparent border-0 outline-none text-xs text-gray-600"
                            aria-label="Search"
                        />
                    </div>

                    <div className="flex items-center gap-4 text-white">
                        <button
                            onClick={handleAuthAction}
                            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 bg-white rounded-full px-5 py-2 shadow-md hover:shadow-lg hover:scale-105 ${keycloak.authenticated ? 'text-red-500' : 'text-[#4c1d95]'
                                }`}
                            aria-label={keycloak.authenticated ? 'Sign Out' : 'Sign In'}
                        >
                            {keycloak.authenticated ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-500">
                                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                    <line x1="12" y1="2" x2="12" y2="12" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#4c1d95]">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            )}
                            <span className="font-bold text-sm">
                                {keycloak.authenticated ? 'Sign Out' : 'Sign In'}
                            </span>
                        </button>
                    </div>
                </nav>
            </header>

            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleConfirmLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
};

export default PageHeader;
