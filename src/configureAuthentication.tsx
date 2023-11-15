import { FC } from "react";
import { AuthenticationProviderFactory } from "./components/AuthenticationProvider/AuthenticationProvider.js";


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
        )
    }
}