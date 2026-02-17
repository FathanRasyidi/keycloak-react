const Footer = () => {
    return (
        <footer className="w-full mt-auto py-6">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
                <div className="text-xs text-graygray-500 text-center md:text-left">
                    <p className="font-normal">
                        &copy; 2026{' '}
                        <span className="font-bold text-[#42bda9]">
                            Pemerintah Daerah Istimewa Yogyakarta
                        </span>
                        . All rights reserved.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 gap-y-2 text-xs text-gray-500">
                    <a
                        href="https://drive.google.com/file/d/1nvLDfcjULstrpKbt-8o3nSY23FgCMxl4/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#42bda9] transition-colors"
                    >
                        <span className="material-icons-round text-sm">policy</span>
                        <span>Kebijakan Privasi</span>
                    </a>
                    <span className="text-gray-300">•</span>
                    <a
                        href="https://diskominfo.notion.site/28e22b0cdb8080e6a777e835aee5cff7?pvs=105"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#42bda9] transition-colors"
                    >
                        <span className="material-icons-round text-sm">feedback</span>
                        <span>Kritik & Saran</span>
                    </a>
                    <span className="text-gray-300">•</span>
                    <a
                        href="https://discord.com/servers/diskominfo-diy-905311916359041064"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#42bda9] transition-colors"
                    >
                        <span className="material-icons-round text-sm">support_agent</span>
                        <span>Kontak Kami</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
