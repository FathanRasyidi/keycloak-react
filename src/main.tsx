import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './auth/keycloak'

const eventLogger = (event: unknown, error: unknown) => {
  console.log('onKeycloakEvent', event, error)
}

const tokenLogger = (tokens: unknown) => {
  console.log('onKeycloakTokens', tokens)
}

// StrictMode is disabled to prevent double initialization issues with Keycloak in development
createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{ onLoad: 'check-sso' }}
    onEvent={eventLogger}
    onTokens={tokenLogger}
  >
    <App />
  </ReactKeycloakProvider>
)
