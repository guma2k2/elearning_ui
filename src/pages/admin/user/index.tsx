import { useEffect, useState } from 'react';
import { Table, Button, Flex, Col, Drawer, Form, Input, Row, Select, Space, Popconfirm, Upload, message, Switch, InputNumber } from 'antd';
import type { PaginationProps, GetProp, UploadProps, TableColumnsType } from 'antd';
import UserPhoto from "../../../assets/userPhoto.png"
import "./User.style.scss"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadFile } from '../../../services/MediaService';
import { UserGetDetailType, UserType } from './UserType';
import { get, getWithPagination, save, update } from '../../../services/UserService';



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

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
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
const data: UserType[] = [];
for (let i = 1; i < 100; i++) {
    data.push({
        key: i,
        id: i,
        photoId: "",
        email: `Edward King@ ${i}.com`,
        active: true,
        firstName: `Edward  ${i}`,
        lastName: `King ${i}`,
        gender: `FEMALE`,
        role: "ROLE_ADMIN"
    });
}
function User() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [currentUser, setCurrentUser] = useState<UserGetDetailType>();
    const [userList, setUserList] = useState<UserType[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getWithPagination(current - 1, pageSize);

            if (res && res.status === 200) {
                console.log(res);
                setUserList(res.data.content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchUsers()
    }, [current, pageSize])


    const columns: TableColumnsType<UserType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        }, {
            title: 'Photo',
            dataIndex: 'photo',
            width: 150,
            render: (text, record) => {
                if (record.photoURL === "") {
                    return <img src={UserPhoto} alt='User photo' style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                }
                return <img src={record.photoURL} alt='User photo' style={{ width: "50px", height: "50px", objectFit: "cover" }} />
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 250,
        },
        {
            title: 'First name',
            dataIndex: 'firstName',
            width: 200,
        },
        {
            title: 'Last name',
            dataIndex: 'lastName',
            width: 200,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            width: 100,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: 100,
        },
        {
            title: 'Action',
            dataIndex: 'key',
            width: 300,
            render: (text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateUser(record.id)}>Edit</Button>
                    <Popconfirm
                        title="Delete this user?"
                        description="Are you sure to delete this user?"
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];
    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const showDrawer = () => {
        setOpen(true);
    };

    const handleUpdateUser = async (userId: number) => {
        console.log(userId);
        setOpen(true)
        const res = await get(userId)
        if (res && res.status === 200) {
            const newCurrentUser = res.data;
            setCurrentUser(res.data);
            form.setFieldsValue({
                ...newCurrentUser,
                day: newCurrentUser.dateOfBirth.split("-")[2],
                month: newCurrentUser.dateOfBirth.split("-")[1],
                year: newCurrentUser.dateOfBirth.split("-")[0],
            })
            setImageUrl(newCurrentUser.photoURL);
        }
    }

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setCurrentUser(undefined)
        setImageUrl("")
    };

    const onFinish = async (values: UserType) => {
        setPending(true);
        console.log(values);
        const type = currentUser ? "update" : "create";
        const checkIsUploadFile = values.photoId?.length ? true : false;
        const checkIsChangePassword = values.password?.length ? true : false;
        let photoId = "";
        if (checkIsUploadFile) {
            var formData = new FormData();
            formData.append("photo", values.photoId[0].originFileObj);
            const res = await uploadFile(formData);
            if (res.status === 200) {
                photoId = res.data.id;
            }
        }
        values = { ...values, photoId: photoId }
        console.log(values);
        if (type === "create") {
            const resSaveUser = await save(values);
            console.log(resSaveUser);
            if (resSaveUser.status === 201) {
                form.resetFields();
                setOpen(false);
            }
        } else {
            const userId = currentUser?.id;
            if (checkIsChangePassword === false) {
                values = { ...values, password: "" }
            }
            const resUpdateUser = await update(values, userId);
            if (resUpdateUser.status === 204) {
                form.resetFields();
                setOpen(false)
            }
        }
        setPending(false)
    };
    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
            console.log(page.current);
            console.log(page.pageSize);
            setCurrent(page.current)
            setPageSize(page.pageSize)
        }
    }

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <div className='user-container'>
            <div className='user-header' >
                <span>User</span>
                <Button onClick={showDrawer} type="primary">Add user</Button>
            </div>
            <Drawer
                title="Create a new user"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={() => form.submit()} disabled={pending} loading={pending}>
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" onFinish={onFinish} form={form} disabled={pending}>
                    <Form.Item
                        name="id"
                        style={{ display: "none" }}
                    >
                        <Input placeholder="Please enter user name" type='hidden' />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First name"
                                rules={[{ required: true, message: 'Please enter user name' }]}
                            >
                                <Input placeholder="Please enter user name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last name"
                                rules={[{ required: true, message: 'Please enter user name' }]}
                            >
                                <Input placeholder="Please enter user name" />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={currentUser == null ? [{ required: true, message: 'Please select an owner' }, { min: 8, message: "the password must be at least 8 characters" }] : []}
                            >
                                <Input type='password' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Please choose the type' }]}
                            >
                                <Input type='email' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[{ required: true, message: 'Please choose the approver' }]}
                            >
                                <Select>
                                    <Select.Option value="MALE">MALE</Select.Option>
                                    <Select.Option value="FEMALE">FEMALE</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                                <Select >
                                    <Select.Option value="ROLE_ADMIN">ROLE_ADMIN</Select.Option>
                                    <Select.Option value="ROLE_INSTRUCTOR">ROLE_INSTRUCTOR</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="day"
                                label="Day"
                                rules={[{ required: true, message: 'Please choose the day' }]}
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
                                rules={[{ required: true, message: 'Please choose the month' }]}
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
                                rules={[{ required: true, message: 'Please choose the year' }]}
                            >
                                <InputNumber style={{ minWidth: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="active" label="Active" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="photoId"
                                label="Photo"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name="photoId"
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
                        </Col>
                    </Row>
                </Form>
            </Drawer>
            <Table columns={columns} dataSource={userList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
        </div>
    )
}

export default User




