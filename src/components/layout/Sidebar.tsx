import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        {
            path: '/',
            label: 'Dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
        },
        {
            path: '/account',
            label: 'Account',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
    ];

    const isActive = (path: string) => {
        if (path === '/') return currentPath === '/';
        return currentPath.startsWith(path);
    };

    return (
        <aside
            className="w-[280px] min-h-screen bg-[#f8f9fa] flex-col p-4 sticky top-0 h-screen overflow-y-auto hidden md:flex"
            aria-label="Main navigation"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-2 mt-4 mb-6">
                <img
                    className="w-[22px]"
                    alt="Logo"
                    src="https://jogjaprov.go.id/storage/files/shares/page/1518066730_2d84b769e3cc9d6f06f8c91a6c3e285c.jpg"
                />
                <h1 className="font-bold text-[#2d3748] text-sm tracking-[0] whitespace-nowrap">
                    PEMDA DIY DASHBOARD
                </h1>
            </div>

            <hr className="mb-6 opacity-40 border-gray-300 mx-4" />

            {/* Navigation Links */}
            <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-[15px] transition-all relative w-full no-underline ${
                                active
                                    ? 'bg-white shadow-[0px_3.5px_5.5px_#00000005]'
                                    : 'hover:bg-gray-100 bg-transparent'
                            }`}
                        >
                            <div
                                className={`p-1.5 rounded-xl ${
                                    active
                                        ? 'bg-[#42bda9] text-white'
                                        : 'bg-white text-tealteal-300 shadow-[0px_3.5px_5.5px_#00000005]'
                                }`}
                            >
                                {item.icon}
                            </div>
                            <span
                                className={`font-bold text-xs tracking-[0] whitespace-nowrap ${
                                    active ? 'text-graygray-700' : 'text-graygray-400'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Help Card */}
            <div className="mt-auto mb-4 p-4 relative">
                <div className="relative rounded-[15px] overflow-hidden bg-[linear-gradient(to_top_right,#42bda9,75%,#0f6486)] p-4 min-h-[120px] flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-bold text-sm mb-1">Need help?</h3>
                        <p className="text-white text-xs">Please Contact Us</p>
                    </div>
                    <a
                        href="https://discord.com/servers/diskominfo-diy-905311916359041064"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white flex items-center justify-center py-2.5 rounded-xl mt-2 hover:opacity-90 transition-opacity"
                    >
                        <span className="font-bold text-graygray-700 text-[10px] tracking-[0]">
                            CONTACT US
                        </span>
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
