import { Button, Col, Form, GetProp, Input, InputNumber, Row, Select, Upload, UploadProps, message } from 'antd';
import './Profile.style.scss'
import { useState, useEffect, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { StudentType } from '../../types/StudentType';
import { uploadFile } from '../../services/MediaService';
import { updateStudent } from '../../services/StudentService';
import { AuthType } from '../../types/AuthType';
import { updateUserProfile } from '../../redux/slices/AuthenticationSlice';
import { UserType } from '../../types/UserType';
import { update } from '../../services/UserService';
import { AxiosError } from 'axios';
import { ErrorType } from '../../types/ErrorType';


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
        label: `Tháng ${i}`
    })
}
function ProfileAdmin() {
    const dispatch = useAppDispatch();
    const [fileType, setFileType] = useState<File>();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const [form] = Form.useForm();
    const onFinish = async (values: UserType) => {
        console.log("submited");
        const checkIsUploadFile = fileType != undefined;
        console.log(checkIsUploadFile);
        const checkIsChangePassword = values.password?.length ? true : false;
        let photo = "";
        console.log(checkIsUploadFile);

        if (checkIsUploadFile) {
            var formData = new FormData();
            formData.append("file", fileType);
            console.log(fileType);
            formData.append("type", "image");
            const res = await uploadFile(formData);
            if (res.status === 200) {
                photo = res.data.url;
            }
        }
        values = { ...values, photo: photo, active: auth?.user.active, role: auth?.user.role }
        if (checkIsChangePassword === false) {
            values = { ...values, password: "" }
        }
        try {
            const resUpdateUser = await update(values, auth?.user.id);
            console.log(values);

            if (resUpdateUser.status === 200) {
                const data = resUpdateUser.data as AuthType;
                alert("Update user info succesful");
                dispatch(updateUserProfile(data))
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message);
            }
        }

    }
    const [imageUrl, setImageUrl] = useState<string>();


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
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selected = files[0] as File;
            const url = URL.createObjectURL(selected);
            console.log(selected);
            setImageUrl(url);
            setFileType(selected);
        }
    }
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
                        label="Ngày"
                    >
                        <Select >
                            {day.map((item) => <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="month"
                        label="Tháng"
                    >
                        <Select >
                            {month.map((item) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="year"
                        label="Năm"
                    >
                        <InputNumber style={{ minWidth: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Mật khẩu" name="password">
                <Input placeholder="Nhập mật khẩu" type='password' />
            </Form.Item>

        </Form>
        {imageUrl && <img className='user-profile-photo' src={imageUrl} alt="avatar" />}
        <Input type="file" onChange={handleFileChange} />
        <Button onClick={() => form.submit()} type="primary">Xác nhận</Button>
    </div>;
}

export default ProfileAdmin;