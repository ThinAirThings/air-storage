import { FC } from "react";
import { AirAuthenticationProviderFactory } from "./components/AirAuthenticationProvider/AirAuthenticationProvider.js";


export type AuthenticationConfig = {
    authenticationApiBaseUrl: string,
    oauthEndpoint: string,
    clientId: string,
    grantTokenRedirectUrl: string
    Loading: FC
}

export const configureAuthentication = (config: AuthenticationConfig) => {
    return {
        AirAuthenticationProvider: AirAuthenticationProviderFactory(
            config
        )
    }
}