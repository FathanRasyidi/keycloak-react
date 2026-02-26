interface LoginModalProps {
    isOpen: boolean;
    onSignIn: () => void;
    onCancel: () => void;
}

const LoginModal = ({ isOpen, onSignIn, onCancel }: LoginModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden transform transition-all scale-100 opacity-100">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Sign In Required</h3>
                    </div>
                    <p className="text-sm text-gray-500">You need to sign in to access this page.</p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-2">
                    <button
                        onClick={onSignIn}
                        type="button"
                        className="inline-flex justify-center rounded-xl bg-[#4c1d95] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#fbbf24] sm:w-auto"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onCancel}
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
