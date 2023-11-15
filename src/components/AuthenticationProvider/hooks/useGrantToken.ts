import { useEffect } from "react"
import { AuthenticationState} from "../AuthenticationProvider.js"
import { useLocation } from "react-router-dom"
import { AuthenticationConfig } from "../../../configureAuthentication.js"


export const useGrantToken = (
    setAuthenticationState: (authenticationState: AuthenticationState) => void,
    config: AuthenticationConfig
) => {
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === '/authentication/token') {
            (async () => {
                try {
                    const grantTokenResponse = await fetch(`https://${config.oauthEndpoint}/oauth2/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'grant_type': 'authorization_code',
                        'client_id': `${config.clientId}`,
                        'code': new URLSearchParams(window.location.search).get('code')!,
                        'redirect_uri': `${config.grantTokenRedirectUrl}`
                    })
                })
                    const {refresh_token} = await grantTokenResponse.json()
                    // Bounce off server for cookie refresh
                    await fetch(`https://${config.authenticationApiBaseUrl}/create-refresh-cookie`, {
                        method: 'POST',
                        credentials: 'include',
                        body: JSON.stringify({
                            refreshToken: refresh_token
                        }),
                        mode: 'cors'
                    })
                    // Trigger Refresh
                    setAuthenticationState({status: 'refresh', accessToken: null})
                } catch (error) {
                    console.error(error)
                    setAuthenticationState({status: 'unauthenticated', accessToken: null})
                }
            })()
        }
    }, [location.pathname])
}