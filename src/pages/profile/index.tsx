import { Button, Form, Input, Upload } from 'antd';
import './Profile.style.scss'
import { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

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
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return <div className="profile-container">
        <h2 className='profile-header'>Hồ sơ & cài đặt</h2>
        <Form
            layout={"vertical"}
            form={form}
            onFinish={onFinish}
        >
            <Form.Item label="Họ" name="" >
                <Input placeholder="Nhập họ" />
            </Form.Item>
            <Form.Item label="Tên">
                <Input placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item label="Giới thiệu bản thân">
                <Input placeholder="Nhập giới thiệu" />
            </Form.Item>
            <Form.Item label="Mật khẩu">
                <Input placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
                name="photoId"
                label="Ảnh đại diện"
                valuePropName="fileList"
            // getValueFromEvent={normFile}
            >
                <Upload
                    name="photoId"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                // beforeUpload={beforeUpload}
                // onChange={handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary">Xác nhận</Button>
            </Form.Item>
        </Form>
    </div>;
}

export default Profile;