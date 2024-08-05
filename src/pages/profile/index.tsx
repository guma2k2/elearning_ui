import { Button, Col, Form, GetProp, Input, InputNumber, Row, Select, Upload, UploadProps, message } from 'antd';
import './Profile.style.scss'
import { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { StudentType } from '../../types/StudentType';
import { uploadFile } from '../../services/MediaService';
import { updateStudent } from '../../services/StudentService';
import { AuthType } from '../../types/AuthType';
import { updateUserProfile } from '../../redux/slices/AuthenticationSlice';


type Day = {
    value: number
}
const day: Day[] = [];

for (let i = 1; i <= 31; i++) {
    day.push({
        value: i
    })
}

const month: Month[] = [];
type Month = {
    value: number,
    label: string
}
for (let i = 1; i <= 12; i++) {
    month.push({
        value: i,
        label: `Thang ${i}`
    })
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
function Profile() {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const [form] = Form.useForm();
    const onFinish = async (values: StudentType) => {
        console.log("submited");

        console.log(values);
        const checkIsUploadFile = values.photo?.length ? true : false;
        const checkIsChangePassword = values.password?.length ? true : false;
        let photo = "";
        console.log(checkIsUploadFile);

        if (checkIsUploadFile) {
            var formData = new FormData();
            formData.append("photo", values.photo[0].originFileObj);
            formData.append("type", "photo");
            const res = await uploadFile(formData);
            if (res.status === 200) {
                photo = res.data.url;
            }
        }
        values = { ...values, photo: photo }
        if (checkIsChangePassword === false) {
            values = { ...values, password: "" }
        }
        const resUpdateUser = await updateStudent(values);
        if (resUpdateUser.status === 200) {
            const data = resUpdateUser.data as AuthType;
            dispatch(updateUserProfile(data))
        }
    }
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const handleChange: UploadProps['onChange'] = (info) => {
        console.log(info.file.status);

        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                console.log(url);
                setImageUrl(url);
            });
        }
    };
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        if (auth) {
            const user = auth.user;
            form.setFieldsValue({
                ...user,
                day: user.dateOfBirth.split("-")[2],
                month: user.dateOfBirth.split("-")[1],
                year: user.dateOfBirth.split("-")[0],
            })
            setImageUrl(user.photoURL);
        }
    }, [])
    return <div className="profile-container">
        <h2 className='profile-header'>Hồ sơ & cài đặt</h2>
        <Form
            layout={"vertical"}
            form={form}
            onFinish={onFinish}
        >
            <Form.Item name="id" style={{ display: "none" }} >
                <Input type='hidden' />
            </Form.Item>
            <Form.Item label="Họ" name="firstName" >
                <Input placeholder="Nhập họ" />
            </Form.Item>
            <Form.Item label="Tên" name="lastName" >
                <Input placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item label="Tên" name="email" >
                <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
                name="gender"
                label="Giới tính"
            >
                <Select>
                    <Select.Option value="MALE">Nam</Select.Option>
                    <Select.Option value="FEMALE">Nữ</Select.Option>
                </Select>
            </Form.Item>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name="day"
                        label="Day"
                    >
                        <Select >
                            {day.map((item) => <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="month"
                        label="Month"
                    >
                        <Select >
                            {month.map((item) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="year"
                        label="Year"
                    >
                        <InputNumber style={{ minWidth: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Mật khẩu" name="password">
                <Input placeholder="Nhập mật khẩu" type='password' />
            </Form.Item>
            <Form.Item
                name="photo"
                label="Ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={normFile}
            >
                <Upload
                    name="photo"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Form.Item>
            <Form.Item >
                <Button htmlType="submit" type="primary">Xác nhận</Button>
            </Form.Item>
        </Form>
    </div>;
}

export default Profile;