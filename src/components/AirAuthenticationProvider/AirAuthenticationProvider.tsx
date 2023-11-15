import { FC, ReactNode, createContext, useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRefreshToken } from "./hooks/useRefreshToken.js";
import { useGrantToken } from "./hooks/useGrantToken.js";


export type AuthenticationState = {
    status: 'authenticated'
    accessToken: string
} | {
    status: 'unauthenticated'
} | {
    status: 'refresh'
} | {
    status: 'pending'
}

export type CognitoConfig = {
    oauthEndpoint: string,
    clientId: string,
    grantTokenRedirectBasename: string
}

const AuthenticationContext = createContext<{
    accessToken: string,
    protectedFetch: typeof fetch
}>(null as any)

export const AirAuthenticationProviderFactory = (config: {
    authenticationApiBaseUrl: string,
    cognitoConfig: CognitoConfig,
    unauthenticatedRedirectPath: string,
    Loading: FC
}) => ({
    children
}: {
    children: ReactNode
}) => {
    // State
    const [authenticationState, setAuthenticationState] = useState<AuthenticationState>({
        status: 'refresh'
    })
    // Effects
    useRefreshToken(config.authenticationApiBaseUrl, authenticationState, setAuthenticationState)
    useGrantToken(config.authenticationApiBaseUrl, setAuthenticationState, config.cognitoConfig)
    // Callbacks
    const protectedFetch = useCallback<typeof fetch>(async (input, init?) => {
        if (authenticationState.status !== 'authenticated') {
            throw new Error('Cannot call protected fetch while not authenticated')
        }
        const response = await fetch(input as Parameters<typeof fetch>[0], {
            ...init,
            headers: {
                ...init?.headers,
                'Authorization': `Bearer ${authenticationState.accessToken}`,
            }
        })
        if (response.status === 401) {
            setAuthenticationState({
                status: 'unauthenticated'
            })
        }
        return response
    }, [authenticationState])
    // Render
    if (authenticationState.status === 'pending') {
        return <config.Loading/>
    }
    if (authenticationState.status === 'unauthenticated') {
        return <Navigate replace to={config.unauthenticatedRedirectPath}/>
    }
    if (authenticationState.status === 'authenticated') {
        return <AuthenticationContext.Provider value={{
            accessToken: authenticationState.accessToken,
            protectedFetch
        }}>
            {children}
        </AuthenticationContext.Provider>
    }
}