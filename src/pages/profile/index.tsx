import { Button, Form, Input } from 'antd';
import './Profile.style.scss'
type ProfileType = {
    firstName: string,
    lastName: string,
    headline: string,
    profile: string,
    password: string
}
function Profile() {
    const [form] = Form.useForm();
    const onFinish = async (_values: ProfileType) => { }
    return <div className="profile-container">
        <h2 className='profile-header'>Hồ sơ & cài đặt</h2>
        <Form
            layout={"vertical"}
            form={form}
            onFinish={onFinish}
        >
            <Form.Item label="Ho" name="" >
                <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Ten">
                <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Gioi thieu">
                <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Mat khau">
                <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item>
                <Button type="primary">Submit</Button>
            </Form.Item>
        </Form>
    </div>;
}

export default Profile;