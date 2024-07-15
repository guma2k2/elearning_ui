import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function NotPermited() {
    const navigate = useNavigate();
    return <div className="notpermited-container">
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button onClick={() => {
                navigate("/")
            }} type="primary">Back Home</Button>}
        />
    </div>;
}

export default NotPermited;