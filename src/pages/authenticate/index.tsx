import { useEffect } from "react";
import { outboundUser } from "../../services/AuthService";
import { AuthType } from "../../types/AuthType";
import { useAppDispatch } from "../../redux/hooks";
import { saveUserProfile } from "../../redux/slices/AuthenticationSlice";
import { useNavigate } from "react-router-dom";
import { getCartsByUser } from "../../redux/slices/CartSlice";
function Authenticate() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        console.log(window.location.href);

        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const code = isMatch[1];
            console.log(code);
            const fetchUserProfileByCode = async () => {
                const res = await outboundUser(code);
                const data = res.data as AuthType
                dispatch(saveUserProfile(data));
                dispatch(getCartsByUser());
                navigate("/");
            }
            fetchUserProfileByCode();
        }
    }, []);
    return (
        <div>Authenticating...</div>
    )
}

export default Authenticate