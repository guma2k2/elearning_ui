import { Button, Col, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Switch, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { TopicType } from "./TopicType";
import { getCategoryParents } from "../../../services/CategoryService";
import TextArea from "antd/es/input/TextArea";
import { get, getTopicWithPagination, save, update } from "../../../services/TopicService";
import './Topic.style.scss'

function Topic() {
    const [open, setOpen] = useState<boolean>(false);
    const [pending, setPending] = useState(false);
    const [categoryParents, setCategoryParents] = useState<CategoryListGetType[]>([]);
    const [categoryChildrens, setCategoryChildrens] = useState<CategoryType[]>([]);
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentTopicId, setCurrentTopicId] = useState<number | undefined>();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [form] = Form.useForm();
    const columns: TableColumnsType<TopicType> = [
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
                    <Button type="primary" onClick={() => handleUpdateTopic(record.id)}>Edit</Button>
                    <Popconfirm
                        title="Delete this user?"
                        description="Are you sure to delete this topic?"
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];
    const handleUpdateTopic = async (topicId: number) => {
        setOpen(true)
        console.log(topicId);
        const res = await get(topicId)
        if (res && res.status === 200) {
            console.log(res.data);
            const newCurrentTopic = res.data;
            setCurrentTopicId(res.data?.id)
            form.setFieldsValue({
                ...newCurrentTopic
            })
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
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };
    const onFinish = async (values: TopicType) => {
        console.log(values);

        setPending(true)
        const type = currentTopicId ? "update" : "create";
        if (type === "create") {
            const resSave = await save(values);
            console.log(resSave);
            if (resSave.status === 201) {
                form.resetFields();
                setOpen(false);
            }
        } else {
            const resUpdateUser = await update(values, currentTopicId);
            if (resUpdateUser.status === 204) {
                form.resetFields();
                setOpen(false)
            }
        }
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        setPending(false)
    }
    const handleChangeCategories = (value: string) => {
        console.log(value);
        categoryParents.forEach((cat: CategoryListGetType) => {
            if (cat.name === value) {
                console.log(cat.childrens);
                setCategoryChildrens(cat.childrens)
                return;
            }
        })
    }

    useEffect(() => {
        const fetchTopics = async () => {
            const res = await getTopicWithPagination(current - 1, pageSize);
            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((topic: TopicType) => (
                    {
                        ...topic, key: topic.id
                    }
                ))
                console.log(content)
                setTopics(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchTopics()
    }, [current, pageSize, isDataUpdated])


    useEffect(() => {
        const fetchCategoryParents = async () => {
            const res = await getCategoryParents();
            if (res.status === 200) {
                console.log(res);
                const data = res.data.map((cat: CategoryType) => ({
                    key: cat.id, ...cat
                }))
                setCategoryParents(data);

            }
        }
        fetchCategoryParents()
    }, [])

    return (
        <div className="topic-container">
            <div className='topic-header' >
                <span>Topic</span>
                <Button onClick={showDrawer} type="primary">Add topic</Button>
            </div>
            <Drawer
                title="Create a new topic"
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
                        <Button type="primary" onClick={() => form.submit()} loading={pending} >
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="horizontal" onFinish={onFinish} form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} style={{ maxWidth: "100%" }} disabled={pending}>
                    <Form.Item
                        name="id"
                        style={{ display: "none" }}
                    >
                        <Input placeholder="id" type='hidden' />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Please enter name of category' }]}
                            >
                                <Input placeholder="Please enter name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea rows={4} cols={24} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="parentId"
                                label="Parent"
                            >
                                <Select onChange={handleChangeCategories}  >
                                    {categoryParents && categoryParents.map((cat) => {
                                        return <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="categories"
                                label="Categories"
                            >
                                <Select mode="multiple" >
                                    {categoryChildrens && categoryChildrens.map((cat) => {
                                        return <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="isPublish" label="Publish" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
            <Table columns={columns} dataSource={topics} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
        </div>
    )
}

export default Topic