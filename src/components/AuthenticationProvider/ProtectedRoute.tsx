import { FC, ReactNode } from "react";
import { useAuthentication } from "./AuthenticationProvider.js";
import { Navigate } from "react-router-dom";


export const ProtectedRoute: FC<{
    children: ReactNode
}> = ({
    children
}) => {
    const { accessToken } = useAuthentication()
    if (!accessToken) {
        return <Navigate replace to="/authenticate" />
    }
    return children
}