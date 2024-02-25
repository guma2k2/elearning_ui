import { Button, Flex, Form, Input, Modal, PaginationProps, Popconfirm, Select, Table, TableColumnsType, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'
import './Course.style.scss'
import { CourseType } from '../../../types/CourseType';
import { createCourse, getCourseWithPagination } from '../../../services/CourseService';
import { SearchOutlined } from '@ant-design/icons';
import { getCategoryParents } from '../../../services/CategoryService';
import { TopicType } from '../topic/TopicType';
import { getTopicsByCategoryId } from '../../../services/TopicService';
import { Link } from 'react-router-dom';
type TreeData = {
    title: string;
    value: string;
    children?: TreeData[];
}


function Course() {
    const [open, setOpen] = useState<boolean>(false);
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [treeSelectDatas, setTreeSelectDatas] = useState<TreeData[]>([]);
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [form] = Form.useForm();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
    // const [currentCourseId, setCurrentCourseId] = useState<number | undefined>();
    const columns: TableColumnsType<CourseType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: 150,
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
                    <Button type="primary"><Link to={`edit/${record.id}`}>Edit</Link></Button>
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
        console.log('Clicked cancel button');
        form.resetFields()
        setOpen(false);
    };
    const handleChangeTreeSelect = async (value: number) => {
        console.log(value)
        const res = await getTopicsByCategoryId(value)
        setTopics(res.data)
    }
    const handleFinish = async (value: CourseType) => {
        console.log(value);
        const res = await createCourse(value);
        if (res.status == 201) {
            // setConfirmLoading(false);
            setIsDataUpdated((prev) => !prev)
            form.resetFields()
            setOpen(false);
        }
    }
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getCourseWithPagination(current - 1, pageSize);
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
                title="Create course"
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
                    <Form.Item label="Title" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Categories" name="categoryId" >
                        <TreeSelect
                            treeData={treeSelectDatas} onChange={handleChangeTreeSelect}
                        />
                    </Form.Item>
                    <Form.Item label="Topic" name="topicId" >
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
                        <Button style={{ height: 48, fontSize: "16px" }} onClick={showModel} type="primary">New course</Button>
                    </div>
                </div>
                <Table columns={columns} dataSource={courses} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
            </div>
        </>

    )
}

export default Course