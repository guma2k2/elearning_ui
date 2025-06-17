import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Table, Button, Flex, Col, Drawer, Form, Input, Row, Select, Space, Popconfirm, message, Switch, InputNumber } from 'antd';
import type { PaginationProps, GetProp, UploadProps, TableColumnsType } from 'antd';
import UserPhoto from "../../../assets/userPhoto.png"
import "./User.style.scss"
import { uploadFile } from '../../../services/MediaService';
import { UserGetDetailType, UserType } from '../../../types/UserType';
import { deleteUser, get, getWithPagination, save, update, updateStatus } from '../../../services/UserService';
import { AxiosError } from 'axios';
import { ErrorType } from '../../../types/ErrorType';
import { RootState } from '../../../redux/store';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { AuthType } from '../../../types/AuthType';
import { updateUserProfile } from '../../../redux/slices/AuthenticationSlice';
import { ADD_SUCCESS_MESSAGE, DELETE_SUCCESS_MESSAGE, UPDATE_SUCCESS_MESSAGE, showMessage } from '../../../utils/MessageUtil';



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
const User: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    const handleUpdateStatus = async (checked: boolean, id: number) => {
        const res = await updateStatus(checked, id);
        if (res.status === 204) {
            toggleActiveField(id, checked);
            showMessage(UPDATE_SUCCESS_MESSAGE, "success")
        }
    }

    const toggleActiveField = (id: number, newActive: boolean) => {
        setUserList((prevUserList) =>
            prevUserList.map((user) =>
                user.id === id ? { ...user, active: newActive } : user
            )
        );
    };
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

    const updateUser = (updatedUser: UserType) => {
        setUserList((prevUserList) =>
            prevUserList.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };

    const columns: TableColumnsType<UserType> = [
        {
            title: 'Mã người dùng',
            dataIndex: 'id',
            width: 130,
        }, {
            title: 'Ảnh ',
            dataIndex: 'photo',
            width: 100,
            render: (_text, record) => {
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
            width: 150,
        },
        {
            title: 'Tên',
            dataIndex: 'lastName',
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            width: 200,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Ẩn" checked={record.active} onChange={(checked: boolean) => handleUpdateStatus(checked, record.id)} />
                </Flex>
            ),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    {record.gender == "MALE" && "Nam"}
                    {record.gender == "FEMALE" && "Nữ"}
                </Flex>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: 150,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    {record.role == "ROLE_INSTRUCTOR" && "Giáo viên"}
                    {record.role == "ROLE_ADMIN" && "Quản trị viên"}
                </Flex>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateUser(record.id)}>Cập nhật</Button>
                    {/* <Popconfirm
                        title="Xóa người dùng này?"
                        description="Bạn có chắc chắn xóa người dùng này?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm> */}
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
        const emailUser = values.email;
        setPending(true);
        console.log(values);
        const type = currentUser ? "update" : "create";
        const checkIsUploadFile = fileType != undefined;
        console.log(checkIsUploadFile);
        const checkIsChangePassword = values.password?.length ? true : false;
        let photo = "";
        if (checkIsUploadFile) {
            var formData = new FormData();
            formData.append("file", fileType);
            formData.append("type", "image");
            const res = await uploadFile(formData);
            if (res.status === 200) {
                photo = res.data.url;
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset the file input value
                }
            }
        }
        const newValues: UserType = { ...values, photo: photo, email: emailUser.trim() }
        console.log(values);
        if (type === "create") {
            try {
                const resSaveUser = await save(newValues);
                console.log(resSaveUser);
                if (resSaveUser.status === 201) {
                    showMessage(ADD_SUCCESS_MESSAGE, "success")
                    form.resetFields();
                    setOpen(false);
                    setIsDataUpdated((isDataUpdated) => !isDataUpdated)
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    setPending(false)
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details as string;
                    var fieldError: string = ""
                    if (data.fieldErrors && data.fieldErrors.length > 0) {
                        var fieldError: string = ""
                        data.fieldErrors.forEach((err) => {
                            fieldError += err + ", ";
                        })
                    }
                    showMessage(message + ": " + fieldError, "error")
                    return;

                }
            }

        } else {
            try {
                const userId = currentUser?.id;
                if (checkIsChangePassword === false) {
                    values = { ...values, password: "" }
                }
                const resUpdateUser = await update(newValues, userId);
                if (resUpdateUser.status === 200) {
                    showMessage(UPDATE_SUCCESS_MESSAGE, "success")
                    const data = resUpdateUser.data as AuthType;
                    const actualData = resUpdateUser.data as UserType
                    updateUser(actualData)
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
                    showMessage(message, "error")
                    setPending(false)
                    return;
                }
            }

        }
        setPending(false)
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteUser(id);
            if (res.status == 204) {
                setIsDataUpdated((prev) => !prev);
                showMessage(DELETE_SUCCESS_MESSAGE, "success");
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                showMessage(message, "error");
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
                            <Input type='hidden' />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="firstName"
                                    label="Họ"
                                    rules={[{ required: true, message: 'Họ không được để trống' }]}
                                >
                                    <Input placeholder="Nhập họ" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Tên"
                                    rules={[{ required: true, message: 'Tên không được để trống' }]}
                                >
                                    <Input placeholder="Nhập tên" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu"
                                    rules={currentUser == null ? [{ required: true, message: 'Mật khẩu không được để trống' }, { min: 6, message: "the password must be at least 6 characters" }] : []}
                                >
                                    <Input type='password' placeholder="Nhập mật khẩu" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Email không được bỏ trống' }]}
                                >
                                    <Input type='email' placeholder="Nhập email" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="gender"
                                    label="Giới tính"
                                >
                                    <Select>
                                        <Select.Option value="MALE">Nam</Select.Option>
                                        <Select.Option value="FEMALE">Nữ</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="role"
                                    label="Vai trò"
                                    rules={[{ required: true, message: 'Hãy chọn vai trò cho người dùng' }]}
                                >
                                    <Select >
                                        <Select.Option value="ROLE_ADMIN">Quản trị viên</Select.Option>
                                        <Select.Option value="ROLE_INSTRUCTOR">Giáo viên</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="day"
                                    label="Ngày"
                                    rules={[{ required: true, message: 'Hãy chọn ngày' }]}
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
                                    rules={[{ required: true, message: 'Hãy chọn tháng' }]}
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
                                    rules={[{ required: true, message: 'Hãy chọn năm' }]}
                                >
                                    <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                    {imageUrl && <img className='user-profile-photo' src={imageUrl} alt="avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", objectFit: "cover" }} />}
                    <input ref={fileInputRef} type="file" onChange={handleFileChange} />
                </Drawer>
                <Table columns={columns} dataSource={userList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
            </div>
        </>
    )
}

export default User




