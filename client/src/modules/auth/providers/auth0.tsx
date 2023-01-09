import React from 'react';
import { useAuth0, Auth0Provider } from '@auth0/auth0-react';

import { AuthContextType } from './common-types';

export const useAuth = (): AuthContextType => {
  const { isAuthenticated, getAccessTokenSilently, loginWithPopup, logout } =
    useAuth0();

  return {
    isAuthenticated,
    login: loginWithPopup,
    logout,
    getToken: getAccessTokenSilently,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: create a module to handle environment variables
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE as string;
  const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL as string;

  // TODO: Can we conditionally use window.location.origin for the redirectUri
  // if we're in the browser? Or should we require site maintainers to supply
  // it?

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={clientURL}
      audience={audience}
    >
      {children}
    </Auth0Provider>
  );
};
