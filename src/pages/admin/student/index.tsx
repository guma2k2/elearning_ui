import { useEffect, useState } from 'react';
import { StudentType } from '../../../types/StudentType';
import { Table, Flex, Switch, TableColumnsType, PaginationProps } from 'antd';
import UserPhoto from "../../../assets/userPhoto.png"
import './StudentManagement.style.scss'
import { getWithPagination, updateStatus } from '../../../services/StudentService';
function StudentManagement() {
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [studentList, setStudentList] = useState<StudentType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>();

    const handleUpdateStatus = async (checked: boolean, id: number) => {
        const res = await updateStatus(checked, id);
        if (res.status === 204) {
            setIsDataUpdated((prev) => !prev);
        }
    }
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getWithPagination(current - 1, pageSize);

            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((student: StudentType) => (
                    {
                        ...student, key: student.id
                    }
                ))
                console.log(content)
                setStudentList(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchUsers()
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

                if (record.photo === "") {
                    return <img src={UserPhoto} alt='User photo' style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "50%" }} />
                }
                return <img src={record.photo} alt='User photo' style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "50%" }} />
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
            title: 'Active',
            dataIndex: 'active',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Switch checkedChildren="active" unCheckedChildren="unactive" checked={record.active} onChange={(checked: boolean) => handleUpdateStatus(checked, record.id)} />
                </Flex>
            ),
        }
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
        <Table columns={columns} dataSource={studentList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>
}

export default StudentManagement;