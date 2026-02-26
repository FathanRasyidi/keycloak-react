import { useKeycloak } from '@react-keycloak/web';
import Footer from '../components/layout/Footer';

const quickAccessItems = [
    {
        label: 'Kesehatan',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        label: 'Pendidikan',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
            </svg>
        ),
    },
    {
        label: 'Sosial',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        label: 'Pemerintahan',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <line x1="8" y1="6" x2="8" y2="6.01" />
                <line x1="12" y1="6" x2="12" y2="6.01" />
                <line x1="16" y1="6" x2="16" y2="6.01" />
                <line x1="8" y1="10" x2="8" y2="10.01" />
                <line x1="12" y1="10" x2="12" y2="10.01" />
                <line x1="16" y1="10" x2="16" y2="10.01" />
                <line x1="8" y1="14" x2="8" y2="14.01" />
                <line x1="12" y1="14" x2="12" y2="14.01" />
                <line x1="16" y1="14" x2="16" y2="14.01" />
            </svg>
        ),
    },
    {
        label: 'Kependudukan',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <path d="M14 10h4" />
                <path d="M14 14h4" />
            </svg>
        ),
    },
    {
        label: 'Layanan Kepolisian',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    {
        label: 'Layanan Satu Data',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
        ),
    },
    {
        label: 'Layanan Keuangan',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <rect x="1" y="6" width="22" height="14" rx="2" ry="2" />
                <path d="M1 10h22" />
                <circle cx="17" cy="14" r="1.5" />
            </svg>
        ),
    },
    {
        label: 'Jelajahi Jogja',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
    {
        label: 'Etalase Jogja',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        ),
    },
    {
        label: 'E-Lapor',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        label: 'CCTV',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
    },
];

const newsItems = [
    {
        date: 'Feb 5, 2026',
        title: 'Jogja Smart Province Update',
        description: 'New implementation of digital ID rollout starts next week.',
    },
    {
        date: 'Feb 4, 2026',
        title: 'Traffic Regulations 2026',
        description: 'Updated Malioboro traffic zones during weekends.',
    },
    {
        date: 'Feb 1, 2026',
        title: 'Cultural Festival Dates',
        description: 'Schedule for the upcoming Sekaten festival.',
    },
];

const Home = () => {
    const { keycloak } = useKeycloak();

    return (
        <div className="flex flex-col gap-2">
            {/* Hero Section */}
            <div className="relative w-full h-[280px] rounded-[25px] overflow-hidden shadow-md mb-8">
                <div className="absolute inset-0 bg-[linear-gradient(to_top_right,#4c1d95,60%,#fbbf24)] opacity-80 z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        {keycloak.authenticated
                            ? `Sugeng Rawuh, ${keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username}`
                            : 'Sugeng Rawuh, Warga Jogja'}
                    </h1>
                    <p className="text-lg opacity-90 max-w-2xl">
                        Akses layanan publik Pemerintah Daerah DIY dengan mudah, cepat, dan transparan melalui satu pintu.
                    </p>
                    <a
                        href="#quick-access"
                        className="mt-6 bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-xl w-fit hover:bg-yellow-400 transition-colors shadow-lg no-underline"
                    >
                        Jelajahi Layanan
                    </a>
                </div>
            </div>

            {/* Quick Access Section */}
            <section id="quick-access" className="mb-8 text-center scroll-mt-6">
                <div className="mb-8">
                    <h2 className="font-bold text-gray-800 text-2xl mb-2 relative inline-block">
                        Layanan Publik
                        <div className="h-1 w-12 bg-[#4c1d95] mx-auto mt-2 rounded-full"></div>
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
                        Dapatkan layanan publik untuk memenuhi kebutuhan masyarakat Yogyakarta dengan mudah
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {quickAccessItems.map((item) => (
                        <button
                            key={item.label}
                            className="flex flex-col items-center justify-center p-6 bg-white rounded-[15px] shadow-sm hover:shadow-md transition-all border border-transparent hover:border-[#4c1d95]/30 group cursor-pointer h-full"
                        >
                            <div className="mb-4 text-[#4c1d95] group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-gray-700 font-medium text-xs text-center leading-tight">
                                {item.label}
                            </h3>
                        </button>
                    ))}
                </div>
            </section>

            {/* News Section */}
            <section className="bg-transparent ">
                <h2 className="font-bold text-graygray-700 text-lg mb-4 flex justify-between items-center">
                    <span>Berita Terkini</span>
                    <span className="text-[#734da8] text-xs cursor-pointer hover:text-[#4c1d95] transition-colors">
                        Lihat Semua
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {newsItems.map((news, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[15px] overflow-hidden shadow-[0px_3.5px_5.5px_#00000005] hover:shadow-lg transition-shadow flex flex-col h-full"
                        >
                            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-2">
                                    <span className="bg-yellow-50 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                        {news.date}
                                    </span>
                                </div>
                                <h3 className="font-bold text-graygray-700 text-sm mb-2 line-clamp-2">
                                    {news.title}
                                </h3>
                                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                                    {news.description}
                                </p>
                                <button className="mt-auto text-[#734da8] text-xs font-bold text-left hover:text-[#4c1d95] transition-colors">
                                    Baca Selengkapnya &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
