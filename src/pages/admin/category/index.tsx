import { Button, Col, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Switch, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import './Category.style.scss'
import TextArea from "antd/es/input/TextArea";
import { getCategoryParents } from "../../../services/CategoryService";

const data: CategoryType[] = [];
for (let i = 1; i < 100; i++) {
    data.push({
        id: i,
        description: "desc",
        name: `Edward King@ ${i}.com`,
        isPublish: true,
        createdAt: "31/1/2024",
        updatedAt: "31/1/2024",
    });
}
function Category() {
    const [open, setOpen] = useState<boolean>(false);
    const [categoryParents, setCategoryParents] = useState<CategoryListGetType[]>([]);
    const [form] = Form.useForm();
    const columns: TableColumnsType<CategoryType> = [
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
            width: 200,
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            width: 200,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            width: 200,
        },
        {
            title: 'Action',
            dataIndex: 'key',
            width: 300,
            render: (text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateCategory(record.id)}>Edit</Button>
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
    const handleUpdateCategory = (catId: number) => {
        console.log(catId);
    }
    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
            console.log(page.current);
            console.log(page.pageSize);
        }
    }
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        // form.resetFields();
    };
    const onFinish = (values: CategoryType) => { }

    useEffect(() => {
        const fetchCategoryParents = async () => {
            const res = await getCategoryParents();
            if (res.status === 200) {
                console.log(res);
                setCategoryParents(res.data);
            }
        }
        fetchCategoryParents()
    }, [])

    return (
        <div className="category-container">
            <div className='category-header' >
                <span>Category</span>
                <Button onClick={showDrawer} type="primary">Add category</Button>
            </div>
            <Drawer
                title="Create a new category"
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
                        <Button type="primary" onClick={() => form.submit()} >
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" onFinish={onFinish} form={form} wrapperCol={{ span: 16 }} >
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
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{}]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="parentId"
                                label="Parent"
                            >
                                <Select >
                                    {categoryParents && categoryParents.map((cat) => {
                                        return <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
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
            <Table columns={columns} dataSource={data} pagination={{ defaultPageSize: 5, defaultCurrent: 1 }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
        </div>
    )
}

export default Category