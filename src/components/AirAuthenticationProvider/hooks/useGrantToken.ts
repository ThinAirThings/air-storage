import { useEffect } from "react"
import { AuthenticationState } from "../AirAuthenticationProvider.js"
import { useLocation } from "react-router-dom"


export type CognitoConfig = {
    authDomain: string,
    clientId: string,
    grantTokenRedirectBasename: string
}

export const useGrantToken = (
    authenticationApiOrigin: string,
    setAuthenticationState: (authenticationState: AuthenticationState) => void,
    cognitoConfig: CognitoConfig
) => {
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === '/authentication/token') {
            (async () => {
                const grantTokenResponse = await fetch(`https://${cognitoConfig.authDomain}/oauth2/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'grant_type': 'authorization_code',
                        'client_id': `${cognitoConfig.clientId}`,
                        'code': new URLSearchParams(window.location.search).get('code')!,
                        'redirect_uri': `${cognitoConfig.grantTokenRedirectBasename}/authentication/token`
                    })
                })
                const {refresh_token} = await grantTokenResponse.json()
                // Bounce off server for cookie refresh
                await fetch(`https://${authenticationApiOrigin}/create-refresh-cookie`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        refreshToken: refresh_token
                    }),
                    mode: 'cors'
                })
                // Trigger Refresh
                setAuthenticationState({status: 'refresh'})
            })()
        }
    }, [location.pathname])
}