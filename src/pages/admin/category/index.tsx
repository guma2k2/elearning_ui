import { Button, Col, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Switch, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import './Category.style.scss'
import TextArea from "antd/es/input/TextArea";
import { get, getWithPagination, save, update } from "../../../services/CategoryService";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchCategoryParents } from "../../../redux/slices/CategorySlice";

function Category() {
    const [open, setOpen] = useState<boolean>(false);
    const [pending, setPending] = useState(false);
    const { categoryParents } = useAppSelector((state) => state.categories);
    const dispatch = useAppDispatch();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentCatId, setCurrentCatId] = useState<number | undefined>();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
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
            render: (_text, record) => (
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
    const handleUpdateCategory = async (catId: number) => {
        setOpen(true)
        console.log(catId);
        const res = await get(catId)
        if (res && res.status === 200) {
            const newCurrentCat = res.data;
            setCurrentCatId(res.data?.id)
            const parentId = res.data.parentId == -1 ? '' : res.data.parentId;
            form.setFieldsValue({
                ...newCurrentCat,
                parentId
            })
        }
    }
    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
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
    const onFinish = async (values: CategoryType) => {
        console.log(values);
        setPending(true)
        const type = currentCatId ? "update" : "create";
        if (type === "create") {
            const resSave = await save(values);
            console.log(resSave);
            if (resSave.status === 201) {
                form.resetFields();
                setOpen(false);
            }
        } else {
            const id = currentCatId;
            const resUpdateUser = await update(values, id);
            if (resUpdateUser.status === 204) {
                form.resetFields();
                setOpen(false)
            }
        }
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        setPending(false)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getWithPagination(current - 1, pageSize);
            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((cat: CategoryType) => (
                    {
                        ...cat, key: cat.id
                    }
                ))
                console.log(content)
                setCategories(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchCategories()
    }, [current, pageSize, isDataUpdated])


    useEffect(() => {
        dispatch(fetchCategoryParents())
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
                                <Select  >
                                    <Select.Option value={""}>Set parent</Select.Option>
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
            <Table columns={columns} dataSource={categories} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
        </div>
    )
}
export default Category
