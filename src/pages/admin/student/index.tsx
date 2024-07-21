import { useEffect, useState } from 'react';
import { StudentType } from '../../../types/StudentType';
import { Table, Button, Flex, Col, Drawer, Form, Input, Row, Select, Space, Popconfirm, Upload, message, Switch, InputNumber, TableColumnsType, PaginationProps, UploadProps, GetProp } from 'antd';
import UserPhoto from "../../../assets/userPhoto.png"
import './StudentManagement.style.scss'
function StudentManagement() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [currentStudent, setCurrentUser] = useState<StudentType>();
    const [userList, setUserList] = useState<StudentType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);

    useEffect(() => {
        // const fetchUsers = async () => {
        //     const res = await getWithPagination(current - 1, pageSize);

        //     if (res && res.status === 200) {
        //         console.log(res);
        //         const content = res.data.content.map((user: UserType) => (
        //             {
        //                 ...user, key: user.id
        //             }
        //         ))
        //         console.log(content)
        //         setUserList(content);
        //         setCurrent(res.data.pageNum + 1);
        //         setPageSize(res.data.pageSize)
        //         setTotalElements(res.data.totalElements)
        //     }
        // }
        // fetchUsers()
    }, [current, pageSize, isDataUpdated])


    const columns: TableColumnsType<StudentType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        }, {
            title: 'Photo',
            dataIndex: 'photo',
            width: 150,
            render: (text, record) => {
                console.log(text);

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
            title: 'Action',
            dataIndex: 'key',
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary">Edit</Button>
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

    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
            console.log(page.current);
            console.log(page.pageSize);
            setCurrent(page.current)
            setPageSize(page.pageSize)
        }
    }

    return <div className="student-management-container">
        <div className='student-header' >
            <span>Student</span>
        </div>
        <Table columns={columns} dataSource={userList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>
}

export default StudentManagement;