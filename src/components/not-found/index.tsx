import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return <div className="notfound-container">
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button onClick={() => {
                navigate("/")
            }} type="primary">Back Home</Button>}
        />
    </div>;
}

export default NotFound;