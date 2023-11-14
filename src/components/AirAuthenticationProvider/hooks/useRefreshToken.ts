import { useEffect } from "react"
import { AuthenticationState } from "../AirAuthenticationProvider.js"



export const useRefreshToken = (
    authenticationApiOrigin: string,
    authenticationState: AuthenticationState,
    setAuthenticationState: (authenticationState: AuthenticationState) => void,
) => {
    useEffect(() => {
        if (authenticationState.status === 'refresh') {
            (async () => {
                try {
                    setAuthenticationState({status: 'pending'})
                    const authResponse = await fetch(`https://${authenticationApiOrigin}/refresh`, {
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