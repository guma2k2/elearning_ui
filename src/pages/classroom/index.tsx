import { Avatar, Card } from 'antd';
import './Classroom.style.scss'
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;
function Classroom() {
    const navigate = useNavigate();
    const redirectToClassroomDetail = () => {
        navigate("/classroom/detail")
    }
    return <div className="classroom-container">
        <Card onClick={redirectToClassroomDetail}
            style={{ width: 300 }}
            cover={
                <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }
        >
            <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title="Card title"
                description="This is the description"
            />
        </Card>

    </div>
}
export default Classroom;