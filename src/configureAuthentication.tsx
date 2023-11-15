import { FC } from "react";
import { AuthenticationProviderFactory, useAuthentication } from "./components/AuthenticationProvider/AuthenticationProvider.js";
import { ProtectedRoute } from "./components/AuthenticationProvider/ProtectedRoute.js";


export type AuthenticationConfig = {
    authenticationApiBaseUrl: string,
    oauthEndpoint: string,
    clientId: string,
    grantTokenRedirectUrl: string
    Loading: FC
}

export const configureAuthentication = (config: AuthenticationConfig) => {
    return {
        AuthenticationProvider: AuthenticationProviderFactory(
            config
        ),
        ProtectedRoute: ProtectedRoute,
        useAuthentication: useAuthentication
    }
}