import Keycloak from 'keycloak-js';

// Function to determine Keycloak URL dynamically based on current window location
const getKeycloakUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    // Assuming Keycloak runs on port 8080 on the same host
    // If protocol is https, you might want 8443 or proper domain.
    // For this requirement: "if webapp http://localhost:3000 -> keycloak http://localhost:8080"
    // "if webapp http://192.168.1.100:3000 -> keycloak http://192.168.1.100:8080"

    // We'll stick to http for now as per example, or use current protocol
    const port = '8080';
    return `${protocol}//${hostname}:${port}`;
};

const keycloakConfig = {
    url: getKeycloakUrl(),
    realm: 'PemdaSSO',
    clientId: 'web-app',
};

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
