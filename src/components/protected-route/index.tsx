import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import RoleBasedRoute from "../role-based-route";
import { ReactNode } from "react";
type PropType = {
    children: ReactNode
}
function ProtectedRoute(prop: PropType) {
    const { children } = prop
    const { isLoggin } = useAppSelector((state: RootState) => state.auth);
    return <>
        {isLoggin == true ? <RoleBasedRoute>{children}</RoleBasedRoute> : <Navigate to={"/login"} />}
    </>
}
export default ProtectedRoute;