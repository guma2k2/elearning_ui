import { useEffect } from "react";
import { outboundUser } from "../../services/AuthService";
function Authenticate() {

    useEffect(() => {
        console.log(window.location.href);

        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const code = isMatch[1];
            console.log(code);
            // const res = outboundUser(code);
            // console.log(res);
        }
    }, []);
    return (
        <div>Authenticating...</div>
    )
}

export default Authenticate