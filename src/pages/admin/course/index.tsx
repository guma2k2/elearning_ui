import { Button, Flex, PaginationProps, Popconfirm, Select, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import './Course.style.scss'
import { CourseType } from './CourseType';
import { getWithPagination } from '../../../services/CourseService';
import { SearchOutlined } from '@ant-design/icons';
function Course() {
    const [open, setOpen] = useState<boolean>(false);
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentCourseId, setCurrentCourseId] = useState<number | undefined>();
    const columns: TableColumnsType<CourseType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: 250,
        },
        {
            title: 'Publish',
            dataIndex: 'isPublish',
            width: 100,
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            width: 300,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            width: 300,
        },
        {
            title: 'Action',
            dataIndex: 'key',
            width: 300,
            render: (text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => {
                        console.log(record.id);
                    }}>Edit</Button>
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
    const showDrawer = () => {
        setOpen(true);
    };
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getWithPagination(current - 1, pageSize);
            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((cat: CourseType) => (
                    {
                        ...cat, key: cat.id
                    }
                ))
                console.log(content)
                setCourses(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchCategories()
    }, [current, pageSize])

    return (
        <div className="course-container">
            <div className='course-header' >
                <span className='course-title'>Courses</span>
                <div className='course-action'>
                    <div className="course-filter">
                        <div className="search">
                            <input type="text" placeholder='Search your courses' />
                            <div className="icon">
                                <SearchOutlined />
                            </div>
                        </div>
                        <Select
                            showSearch
                            style={{ width: 200, fontSize: "16px", height: 48 }}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={[
                                {
                                    value: '1',
                                    label: 'Not Identified',
                                },
                                {
                                    value: '2',
                                    label: 'Closed',
                                },
                                {
                                    value: '3',
                                    label: 'Communicated',
                                },
                                {
                                    value: '4',
                                    label: 'Identified',
                                },
                                {
                                    value: '5',
                                    label: 'Resolved',
                                },
                                {
                                    value: '6',
                                    label: 'Cancelled',
                                },
                            ]}
                        />
                    </div>
                    <Button style={{ height: 48, fontSize: "16px" }} onClick={showDrawer} type="primary">New course</Button>
                </div>
            </div>
            <Table columns={columns} dataSource={courses} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
        </div>
    )
}

export default Course