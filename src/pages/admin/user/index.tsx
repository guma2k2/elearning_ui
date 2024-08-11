import { ChangeEvent, useEffect, useState } from 'react';
import { Table, Button, Flex, Col, Drawer, Form, Input, Row, Select, Space, Popconfirm, message, Switch, InputNumber } from 'antd';
import type { PaginationProps, GetProp, UploadProps, TableColumnsType } from 'antd';
import UserPhoto from "../../../assets/userPhoto.png"
import "./User.style.scss"
import { uploadFile } from '../../../services/MediaService';
import { UserGetDetailType, UserType } from '../../../types/UserType';
import { deleteUser, get, getWithPagination, save, update } from '../../../services/UserService';
import { AxiosError } from 'axios';
import { ErrorType } from '../../../types/ErrorType';
import { RootState } from '../../../redux/store';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { AuthType } from '../../../types/AuthType';
import { updateUserProfile } from '../../../redux/slices/AuthenticationSlice';



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

function User() {
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [fileType, setFileType] = useState<File>();
    const [pending, setPending] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [currentUser, setCurrentUser] = useState<UserGetDetailType | null>();
    const [userList, setUserList] = useState<UserType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getWithPagination(current - 1, pageSize, null);
            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((user: UserType) => (
                    {
                        ...user, key: user.id
                    }
                ))
                console.log(content);
                setUserList(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchUsers()
    }, [current, pageSize, isDataUpdated])


    const columns: TableColumnsType<UserType> = [
        {
            title: 'Mã người dùng',
            dataIndex: 'id',
            width: 200,
        }, {
            title: 'Ảnh ',
            dataIndex: 'photo',
            width: 100,
            render: (text, record) => {
                console.log(text);

                if (record.photoURL === "" || record.photoURL == null) {
                    return <img src={UserPhoto} alt='User photo' style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                }
                return <img src={record.photoURL} alt='User photo' style={{ width: "50px", height: "50px", objectFit: "cover" }} />
            }
        },
        {
            title: 'Địa chỉ email',
            dataIndex: 'email',
            width: 250,
        },
        {
            title: 'Họ',
            dataIndex: 'firstName',
            width: 200,
        },
        {
            title: 'Tên',
            dataIndex: 'lastName',
            width: 200,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            width: 100,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: 100,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateUser(record.id)}>Cập nhật</Button>
                    <Popconfirm
                        title="Xóa người dùng này?"
                        description="Bạn có chắc chắn xóa người dùng này?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    const showDrawer = () => {
        form.resetFields();
        setOpen(true);
        setCurrentUser(undefined);
    };

    const handleUpdateUser = async (userId: number) => {
        console.log(userId);
        setOpen(true)
        const res = await get(userId)
        if (res && res.status === 200) {
            const newCurrentUser = res.data;
            console.log(newCurrentUser);
            setCurrentUser(res.data);
            form.setFieldsValue({
                ...newCurrentUser,
                day: newCurrentUser.dateOfBirth.split("-")[2],
                month: newCurrentUser.dateOfBirth.split("-")[1],
                year: newCurrentUser.dateOfBirth.split("-")[0],
            })
            setImageUrl(newCurrentUser.photo);
        }
    }

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setCurrentUser(null)
        setImageUrl("")
    };

    const onFinish = async (values: UserType) => {
        setPending(true);
        console.log(values);
        const type = currentUser ? "update" : "create";
        const checkIsUploadFile = fileType != undefined;
        const checkIsChangePassword = values.password?.length ? true : false;
        let photo = "";
        if (checkIsUploadFile) {
            var formData = new FormData();
            formData.append("file", fileType);
            formData.append("type", "photo");
            const res = await uploadFile(formData);
            if (res.status === 200) {
                photo = res.data.url;
            }
        }
        values = { ...values, photo: photo }
        console.log(values);
        if (type === "create") {
            try {
                const resSaveUser = await save(values);
                console.log(resSaveUser);
                if (resSaveUser.status === 201) {
                    alert("Add user successful");
                    form.resetFields();
                    setOpen(false);
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    setPending(false)
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    return;

                }
            }

        } else {

            try {
                const userId = currentUser?.id;
                if (checkIsChangePassword === false) {
                    values = { ...values, password: "" }
                }
                const resUpdateUser = await update(values, userId);
                if (resUpdateUser.status === 200) {
                    alert("Update user successful");
                    const data = resUpdateUser.data as AuthType;
                    form.resetFields();
                    setOpen(false)
                    if (userId == auth?.user.id) {
                        dispatch(updateUserProfile(data));
                    }
                }

            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    setPending(false)
                    return;
                }
            }

        }
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        setPending(false)
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteUser(id);
            if (res.status == 204) {
                setIsDataUpdated((prev) => !prev);
                alert("Delete user successful");
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message)
            }
        }
    }
    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
            console.log(page.current);
            console.log(page.pageSize);
            setCurrent(page.current)
            setPageSize(page.pageSize)
        }
    }

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
    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword)
    }

    const handleSearch = async () => {
        const res = await getWithPagination(current - 1, pageSize, keyword);
        if (res && res.status === 200) {
            console.log(res);
            const content = res.data.content.map((user: UserType) => (
                {
                    ...user, key: user.id
                }
            ))
            console.log(content)
            setUserList(content);
            setCurrent(res.data.pageNum + 1);
            setPageSize(res.data.pageSize)
            setTotalElements(res.data.totalElements)
        }
    }
    const confirm = () => {
        form.submit()
    }
    return (
        <>
            <div className='user-container'>
                <div className='user-header' >
                    <span>Người dùng</span>
                    <Button className='user-btn-add' onClick={showDrawer} type="primary">Thêm người dùng</Button>
                </div>
                <div className="user-search">
                    <Input placeholder='Tìm kiếm theo email' className='user-search-input' onChange={handleChangeKeyword} value={keyword} />
                    <Button className='user-search-btn' onClick={handleSearch}>Tìm kiếm</Button>
                </div>
                <Drawer
                    title={`${currentUser ? "Cập nhật người dùng" : "Thêm mới người dùng"}`}
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
                            <Popconfirm
                                title="Xác nhận"
                                description="Bạn có chắc chắn muốn lưu?"
                                onConfirm={confirm}
                                onOpenChange={() => console.log('open change')}
                                disabled={pending}
                            >
                                <Button type="primary"  >
                                    Xác nhận
                                </Button>
                            </Popconfirm>
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
                                    rules={[{ required: true, message: 'Please enter last name' }]}
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
                                    rules={currentUser == null ? [{ required: true, message: 'Please select an owner' }, { min: 6, message: "the password must be at least 6 characters" }] : []}
                                >
                                    <Input type='password' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Email không được bỏ trống' }]}
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
                                    rules={[{ required: true, message: 'Please choose the gender' }]}
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
                                    rules={[{ required: true, message: 'Please choose role for user' }]}
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

                    </Form>
                    {imageUrl && <img className='user-profile-photo' src={imageUrl} alt="avatar" />}
                    <Input type="file" onChange={handleFileChange} />
                </Drawer>
                <Table columns={columns} dataSource={userList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
            </div>
        </>
    )
}

export default User




