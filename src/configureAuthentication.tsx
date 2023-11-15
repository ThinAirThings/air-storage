import { FC } from "react";
import { AirAuthenticationProviderFactory, CognitoConfig } from "./components/AirAuthenticationProvider/AirAuthenticationProvider.js";



export const configureAuthentication = (config: {
    authenticationApiBaseUrl: string,
    cognitoConfig: CognitoConfig,
    unauthenticatedRedirectPath: string,
    Loading: FC
}) => {
    return {
        AirAuthenticationProvider: AirAuthenticationProviderFactory(
            config
        )
    }
}