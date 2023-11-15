import { FC } from "react";
import { CognitoConfig } from "./components/AirAuthenticationProvider/hooks/useGrantToken.js";
import { AirAuthenticationProviderFactory } from "./components/AirAuthenticationProvider/AirAuthenticationProvider.js";



export const configureAuthentication = (
    authenticationApiOrigin: string,
    cognitoConfig: CognitoConfig,
    unauthenticatedRedirectPath: string,
    Loading: FC
) => {
    return {
        AirAuthenticationProvider: AirAuthenticationProviderFactory(
            authenticationApiOrigin,
            cognitoConfig,
            unauthenticatedRedirectPath,
            Loading
        )
    }
}