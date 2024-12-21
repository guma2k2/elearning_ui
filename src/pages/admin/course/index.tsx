import { Button, Col, Flex, Form, Input, Modal, PaginationProps, Popconfirm, Row, Select, Switch, Table, TableColumnsType, Tag, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'
import './Course.style.scss'
import { CourseStatusPostType, CourseType } from '../../../types/CourseType';
import { createCourse, deleteCourse, getCourseWithPagination, updateStatus } from '../../../services/CourseService';
import { SearchOutlined } from '@ant-design/icons';
import { getCategoryParents } from '../../../services/CategoryService';
import { TopicType } from '../topic/TopicType';
import { getTopicsByCategoryId } from '../../../services/TopicService';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ErrorType } from '../../../types/ErrorType';
import { RootState } from '../../../redux/store';
import { useAppSelector } from '../../../redux/hooks';
type TreeData = {
    title: string;
    value: string;
    children?: TreeData[];
}

type CourseStatus = {
    id?: number
    status: string,
    reason: string
}

const Course: React.FC = () => {
    const navigate = useNavigate();
    const { auth } = useAppSelector((state: RootState) => state.auth);

    const [status, setStatus] = useState<string>("ALL");
    const [open, setOpen] = useState<boolean>(false);
    const [openStatus, setOpenStatus] = useState<boolean>(false);
    const [formStatus] = Form.useForm();

    const [courses, setCourses] = useState<CourseType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [treeSelectDatas, setTreeSelectDatas] = useState<TreeData[]>([]);
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [form] = Form.useForm();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");


    const updateStatusCourse = (id: number | undefined, newStatus: CourseStatusPostType) => {
        setCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.id === id ? { ...course, status: newStatus.status, reason: newStatus.reason } : course
            )
        );
    };
    const handleUpdateStatus = async (checked: string, id: number) => {
        if (checked === "UNPUBLISHED") {
            formStatus.setFieldsValue({
                id: id,
            })
            setOpenStatus(true);
        } else {
            const body: CourseStatusPostType = {
                status: checked,
                reason: ""
            }
            const resUpdate = await updateStatus(body, id);
            if (resUpdate.status === 204) {
                updateStatusCourse(id, body)
                alert("success");
            }
        }
    }
    const navigateToClassroom = (courseId: number) => {
        navigate(`/classrooms/course/${courseId}`)
    }


    const onFinishStatus = async (values: CourseStatus) => {
        console.log(values);

        const body: CourseStatusPostType = {
            status: "UNPUBLISHED",
            reason: values.reason
        }
        const resUpdate = await updateStatus(body, values.id);
        if (resUpdate.status === 204) {
            updateStatusCourse(values.id, body)
            alert("success");
            setOpenStatus(false);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteCourse(id);
            if (res.status == 204) {
                setIsDataUpdated((prev) => !prev);
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
    const columns: TableColumnsType<CourseType> = [
        {
            title: 'Mã khóa học',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: 'Tiêu đề khóa học',
            dataIndex: 'title',
            width: 300,

        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Select
                        value={record.status}
                        onChange={(value) => handleUpdateStatus(value, record.id)}
                        style={{ width: 150 }}
                    >
                        <Select.Option value="PUBLISHED">Công khai</Select.Option>
                        <Select.Option value="UNPUBLISHED">Không công khai</Select.Option>
                        <Select.Option value="UNDER_REVIEW">Đang đánh giá</Select.Option>
                    </Select>
                    <Modal
                        title="Trạng thái"
                        open={openStatus}
                        onOk={handleOkStatus}
                        // confirmLoading={confirmLoading}
                        onCancel={handleCancelStatus}
                    >
                        <Form layout="vertical" onFinish={onFinishStatus} form={formStatus} >
                            <Form.Item
                                name="id"
                                style={{ display: "none" }}
                            >
                                <Input type='hidden' />
                            </Form.Item>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="reason"
                                        label="Lý do từ chối"
                                        rules={[{ required: true, }]}
                                    >
                                        <Input placeholder="Nhập lý do" />
                                    </Form.Item>
                                </Col>

                            </Row>

                        </Form>
                    </Modal>
                    {record.status == "UNPUBLISHED" && <Popconfirm
                        title="NGUYÊN NHÂN?"
                        description={`Nguyên nhận: ${record.reason}`}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Button danger>Xem lý do</Button>
                    </Popconfirm>}
                </Flex>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 200,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 350,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary"><Link to={`edit/${record.id}`}>Cập nhật</Link></Button>
                    <Popconfirm
                        title="Xóa khóa học này?"
                        description="Bạn có chắc chắn muốn xóa khóa học này?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                    <Button type="primary"><Link to={`question/${record.id}`}>Câu hỏi</Link></Button>
                    <Button type="primary" onClick={() => navigateToClassroom(record.id)}>Lớp học</Button>
                </Flex>
            ),
        },
    ];
    const columnsForInstuctor: TableColumnsType<CourseType> = [
        {
            title: 'Mã khóa học',
            dataIndex: 'id',
            width: 130,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: 150,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 200,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Tag>{record.status}</Tag>
                    {record.status == "UNPUBLISHED" && <Popconfirm
                        title="NGUYÊN NHÂN?"
                        description={`Nguyên nhân: ${record.reason}`}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Button danger>Xem lý do</Button>
                    </Popconfirm>}
                </Flex>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 350,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => { navigate(`edit/${record.id}`) }} >Cập nhật</Button>
                    <Popconfirm
                        title="Xóa khóa học này?"
                        description="Bạn có chắc chắn muốn xóa khóa học này?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                    <Button type="primary"><Link to={`question/${record.id}`}>Câu hỏi</Link></Button>
                    <Button type="primary" onClick={() => navigateToClassroom(record.id)}>Lớp học</Button>

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
    const mapToTreeDataNode = (category: CategoryListGetType): TreeData => {
        const { id, name, childrens, ...rest } = category;
        const treeDataNode: TreeData = {
            title: name,
            value: id.toString(),
            children: childrens.map((children) => {
                const childTreeData: TreeData = {
                    title: children.name,
                    value: children.id.toString()
                }
                return childTreeData
            }), // Recursively map children
            ...rest, // Add other properties if needed
        };
        return treeDataNode;
    };
    const handleOk = () => {
        // setConfirmLoading(true);
        form.submit()
    };

    const handleOkStatus = () => {
        // setConfirmLoading(true);
        formStatus.submit()
    };

    const showModel = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        form.resetFields()
        setOpen(false);
    };

    const handleCancelStatus = () => {
        formStatus.resetFields()
        setOpenStatus(false);
    };

    const handleChangeTreeSelect = async (value: number) => {
        console.log(value)
        const res = await getTopicsByCategoryId(value)
        setTopics(res.data)
    }
    const handleFinish = async (value: CourseType) => {
        try {
            console.log(value);
            const res = await createCourse(value);
            if (res.status == 201) {
                // setConfirmLoading(false);
                setIsDataUpdated((prev) => !prev)
                form.resetFields()
                setOpen(false);
                alert("Success")
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

    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword)
    }

    const handleSearch = async () => {
        const res = await getCourseWithPagination(current - 1, pageSize, keyword, status);
        if (res && res.status === 200) {
            console.log(res);
            const content = res.data.content.map((course: CourseType) => (
                {
                    ...course, key: course.id
                }
            ))
            console.log(content)
            setCourses(content);
            setCurrent(res.data.pageNum + 1);
            setPageSize(res.data.pageSize)
            setTotalElements(res.data.totalElements)
        }
    }

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getCourseWithPagination(current - 1, pageSize, keyword, status);
            console.log(res);
            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((course: CourseType) => (
                    {
                        ...course, key: course.id
                    }
                ))
                console.log(content)
                setCourses(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchCourses()
    }, [current, pageSize, isDataUpdated, status])

    useEffect(() => {
        const fetchCategoryParents = async () => {
            const res = await getCategoryParents();
            if (res.status === 200) {
                console.log(res);
                const data: CategoryListGetType[] = res.data.map((cat: CategoryListGetType) => ({
                    key: cat.id, ...cat
                }))
                setTreeSelectDatas(data.map((parent) => mapToTreeDataNode(parent)));
            }
        }
        fetchCategoryParents()
    }, [])

    return (
        <>
            <Modal
                title="Tạo khóa học"
                open={open}
                onOk={handleOk}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                    style={{ maxWidth: "100%" }}
                    onFinish={handleFinish}
                    form={form}
                >
                    <Form.Item label="Tiêu đề" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Danh mục" name="categoryId" >
                        <TreeSelect
                            treeData={treeSelectDatas} onChange={handleChangeTreeSelect}
                        />
                    </Form.Item>
                    <Form.Item label="Chủ đề" name="topicId" >
                        <Select  >
                            {topics && topics.map((topic) => {
                                return <Select.Option key={topic.id} value={topic.id}>{topic.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="course-container">
                <div className='course-header' >
                    <span className='course-title'>Khóa học</span>
                    <div className='course-action'>
                        <div className="course-filter">
                            <div className="search">
                                <input type="text" placeholder='Tìm kiếm khóa học theo tiêu đề' onChange={handleChangeKeyword} value={keyword} />
                                <div className="icon" onClick={handleSearch}>
                                    <SearchOutlined />
                                </div>
                            </div>
                            <div className="course-search-status">
                                <Select
                                    value={status}
                                    onChange={(value) => {
                                        setStatus(value);
                                    }}
                                    style={{ width: "250px", height: "100%" }}
                                >
                                    <Select.Option value="ALL">Chọn trạng thái muốn tìm kiếm</Select.Option>
                                    <Select.Option value="PUBLISHED">Công khai</Select.Option>
                                    <Select.Option value="UNPUBLISHED">Không công khai</Select.Option>
                                    <Select.Option value="UNDER_REVIEW">Đang đánh giá</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <Button style={{ height: 48, fontSize: "16px" }} onClick={showModel} type="primary">Tạo khóa học</Button>
                    </div>
                </div>
                <Table columns={auth?.user.role == "ROLE_ADMIN" ? columns : columnsForInstuctor} dataSource={courses} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
            </div>
        </>

    )
}

export default Course