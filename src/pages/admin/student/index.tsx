import { useEffect, useState } from 'react';
import { StudentType } from '../../../types/StudentType';
import { Table, Flex, Switch, TableColumnsType, PaginationProps, Input, Button } from 'antd';
import UserPhoto from "../../../assets/userPhoto.png"
import './StudentManagement.style.scss'
import { getWithPagination, updateStatus } from '../../../services/StudentService';
function StudentManagement() {
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [studentList, setStudentList] = useState<StudentType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>();
    const [keyword, setKeyword] = useState<string>("");
    const handleUpdateStatus = async (checked: boolean, id: number) => {
        const res = await updateStatus(checked, id);
        if (res.status === 204) {
            setIsDataUpdated((prev) => !prev);
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
    useEffect(() => {
        const fetchStudent = async () => {
            const res = await getWithPagination(current - 1, pageSize, null);

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
        fetchStudent()
    }, [current, pageSize, isDataUpdated])


    const columns: TableColumnsType<StudentType> = [
        {
            title: 'Mã học sinh',
            dataIndex: 'id',
            width: 200,
        }, {
            title: 'Ảnh đại diện',
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
            title: 'Trạng thái',
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
            <span>Học sinh</span>
        </div>
        <div className="student-search">
            <Input className='student-search-input' placeholder='Nhập email học sinh' onChange={handleChangeKeyword} value={keyword} />
            <Button className='student-search-btn' onClick={handleSearch}>Tìm kiếm</Button>
        </div>
        <Table columns={columns} dataSource={studentList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>
}

export default StudentManagement;