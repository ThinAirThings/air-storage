import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRefreshToken } from "./hooks/useRefreshToken.js";
import { useGrantToken } from "./hooks/useGrantToken.js";
import { AuthenticationConfig } from "../../configureAuthentication.js";


export type AuthenticationState = {
    status: 'authenticated'
    accessToken: string
} | {
    status: 'unauthenticated'
    accessToken: null
} | {
    status: 'refresh'
    accessToken: null
} | {
    status: 'pending'
    accessToken: null
}



const AuthenticationContext = createContext<{
    accessToken: string | null,
    protectedFetch: typeof fetch
}>({
    accessToken: null,
    protectedFetch: () => console.error('Protected Fetch not initialized. Check AuthenticationProvider code') as any
})
export const useAuthentication = () => useContext(AuthenticationContext)
export const AuthenticationProviderFactory = (config: AuthenticationConfig) => ({
    children
}: {
    children: ReactNode
}) => {
    // State
    const [authenticationState, setAuthenticationState] = useState<AuthenticationState>({
        status: 'refresh',
        accessToken: null
    })
    // Effects
    useRefreshToken(authenticationState, setAuthenticationState, config)
    useGrantToken(setAuthenticationState, config)
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
                status: 'unauthenticated',
                accessToken: null
            })
        }
        return response
    }, [authenticationState])
    // Render
    if (authenticationState.status === 'pending') {
        return <config.Loading/>
    }
    return <AuthenticationContext.Provider value={{
        accessToken: authenticationState.accessToken,
        protectedFetch
    }}>
        {children}
    </AuthenticationContext.Provider>
}