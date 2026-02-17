import { useKeycloak } from '@react-keycloak/web';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import LoginModal from '../components/LoginModal.tsx';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(true);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (!keycloak.authenticated) {
        return (
            <LoginModal
                isOpen={showLoginModal}
                onSignIn={() => {
                    setShowLoginModal(false);
                    keycloak.login();
                }}
                onCancel={() => {
                    setShowLoginModal(false);
                    navigate('/');
                }}
            />
        );
    }

    return <>{children}</>;
};

export default PrivateRoute;
