import { useEffect } from "react"
import { AuthenticationState } from "../AirAuthenticationProvider.js"
import { AuthenticationConfig } from "../../../configureAuthentication.js"



export const useRefreshToken = (
    authenticationState: AuthenticationState,
    setAuthenticationState: (authenticationState: AuthenticationState) => void,
    config: AuthenticationConfig    
) => {
    useEffect(() => {
        if (authenticationState.status === 'refresh') {
            (async () => {
                try {
                    setAuthenticationState({status: 'pending'})
                    const authResponse = await fetch(`https://${config.authenticationApiBaseUrl}/refresh`, {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors'
                    })
                    if (!authResponse.ok) throw new Error("Refresh token failed");
                    const {accessToken} = await authResponse.json()
                    setAuthenticationState({
                        status: 'authenticated',
                        accessToken
                    })
                } catch (error) {
                    setAuthenticationState({status: 'unauthenticated'})
                }
            })()
        }        
    }, [authenticationState.status])
}