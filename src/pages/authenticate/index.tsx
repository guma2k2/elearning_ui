import { useEffect } from "react";
import { outboundUser } from "../../services/AuthService";
import { AuthType } from "../../types/AuthType";
import { useAppDispatch } from "../../redux/hooks";
import { saveUserProfile } from "../../redux/slices/AuthenticationSlice";
import { useNavigate } from "react-router-dom";
function Authenticate() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const code = isMatch[1];
            const fetchUserProfileByCode = async () => {
                const res = await outboundUser(code);
                const data = res.data as AuthType
                dispatch(saveUserProfile(data));
                navigate("/");
            }
            fetchUserProfileByCode();
        } else {
            navigate("/login");
        }
    }, []);
    return (
        <div>Authenticating...</div>
    )
}

export default Authenticate