import { Fragment, ReactNode } from "react";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import NotPermited from "../not-permited";
import { ROLE_ADMIN, ROLE_INSTRUCTOR } from "../../utils/Constants";

type PropType = {
    children: ReactNode
}
function RoleBasedRoute(prop: PropType) {
    const { children } = prop
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const isAdminRoute = window.location.pathname.startsWith("/admin") ? true : false;

    if (isAdminRoute == true) {
        if (auth) {
            const role = auth.user.role as string;
            if (role === ROLE_ADMIN || role === ROLE_INSTRUCTOR) {
                return <>{children}</>
            } else {
                return <NotPermited />
            }
        }
    }
    return <Fragment>{children}</Fragment>
}

export default RoleBasedRoute;