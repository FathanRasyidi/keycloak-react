import { useKeycloak } from '@react-keycloak/web';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (!keycloak.authenticated) {
        keycloak.login();
        return null;
    }

    return <>{children}</>;
};

export default PrivateRoute;
