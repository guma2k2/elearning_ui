import { Button, Flex, Form, Input, Modal, PaginationProps, Popconfirm, Select, Switch, Table, TableColumnsType, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'
import './Course.style.scss'
import { CourseType } from '../../../types/CourseType';
import { createCourse, deleteCourse, getCourseWithPagination, updateStatus } from '../../../services/CourseService';
import { SearchOutlined } from '@ant-design/icons';
import { getCategoryParents } from '../../../services/CategoryService';
import { TopicType } from '../topic/TopicType';
import { getTopicsByCategoryId } from '../../../services/TopicService';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ErrorType } from '../../../types/ErrorType';
import { RootState } from '../../../redux/store';
import { useAppSelector } from '../../../redux/hooks';
type TreeData = {
    title: string;
    value: string;
    children?: TreeData[];
}


function Course() {
    const { auth } = useAppSelector((state: RootState) => state.auth);

    const [open, setOpen] = useState<boolean>(false);
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [treeSelectDatas, setTreeSelectDatas] = useState<TreeData[]>([]);
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [form] = Form.useForm();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");

    const handleUpdateStatus = async (checked: boolean, id: number) => {
        const res = await updateStatus(checked, id);
        if (res.status === 204) {
            setIsDataUpdated((prev) => !prev);
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
            width: 200,
        },
        {
            title: 'Tiêu đề khóa học',
            dataIndex: 'title',
            width: 150,

        },
        {
            title: 'Công khai',
            dataIndex: 'isPublish',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Switch checkedChildren="published" unCheckedChildren="unpublished" checked={record.isPublish} onChange={(checked: boolean) => handleUpdateStatus(checked, record.id)} />
                </Flex>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 300,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 300,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 250,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary"><Link to={`edit/${record.id}`}>Edit</Link></Button>
                    <Popconfirm
                        title="Xóa khóa học này?"
                        description="Bạn có chắc chắn muốn xóa khóa học này?"
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
    const columnsForInstuctor: TableColumnsType<CourseType> = [
        {
            title: 'Mã khóa học',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: 150,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 300,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 300,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 250,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary"><Link to={`edit/${record.id}`}>Edit</Link></Button>
                    <Popconfirm
                        title="Xóa khóa học này?"
                        description="Bạn có chắc chắn muốn xóa khóa học này?"
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
    const showModel = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        form.resetFields()
        setOpen(false);
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
                // handleShowMessage("success", "Save course success", null, dispatch);
                form.resetFields()
                setOpen(false);
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
        const res = await getCourseWithPagination(current - 1, pageSize, keyword);
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
            const res = await getCourseWithPagination(current - 1, pageSize, null);
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
    }, [current, pageSize, isDataUpdated])

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