import { Button, Col, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Switch, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { TopicType } from "./TopicType";
import TextArea from "antd/es/input/TextArea";
import { deleteTopic, get, getTopicWithPagination, save, update } from "../../../services/TopicService";
import './Topic.style.scss'
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchCategoryParents } from "../../../redux/slices/CategorySlice";
import { AxiosError } from "axios";
import { ErrorType } from "../../../types/ErrorType";

function Topic() {
    const [open, setOpen] = useState<boolean>(false);
    const [pending, setPending] = useState(false);
    const { categoryParents } = useAppSelector((state) => state.categories);
    const [categoryChildrens, setCategoryChildrens] = useState<CategoryType[]>([]);
    const dispatch = useAppDispatch();
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentTopicId, setCurrentTopicId] = useState<number | undefined>();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [form] = Form.useForm();
    const handleUpdateStatus = async (checked: boolean, id: number) => {
        const res = await get(id)
        if (res && res.status === 200) {
            const data = res.data as TopicType

            const topicPut = {
                ...data, isPublish: checked
            }
            console.log(checked);
            console.log(topicPut);

            const resOfUpdate = await update(topicPut, id);
            setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        }
    }
    const columns: TableColumnsType<TopicType> = [
        {
            title: 'Mã chủ đề',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Tên chủ đề',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 250,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isPublish',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Switch checkedChildren="published" unCheckedChildren="unpublished" checked={record.isPublish} onChange={(checked: boolean) => handleUpdateStatus(checked, record.id)} />
                </Flex>
            ),
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            width: 300,
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'updatedAt',
            width: 300,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 250,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateTopic(record.id)}>Cập nhật</Button>
                    <Popconfirm
                        title="Xóa chủ đề này?"
                        description="Bạn có chắc chắn xóa chủ đề này?"
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

            try {
                const resSave = await save(values);
                console.log(resSave);
                if (resSave.status === 201) {
                    form.resetFields();
                    setOpen(false);
                    alert("Add successful");
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    setPending(false);
                    return;
                }
            }

        } else {
            try {
                const resUpdateUser = await update(values, currentTopicId);
                if (resUpdateUser.status === 204) {
                    form.resetFields();
                    setOpen(false);
                    alert("Update successful");

                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    setPending(false);
                    return;
                }
            }

        }
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        setPending(false)
    }
    const handleChangeCategories = (value: string) => {
        console.log(value);
        if (categoryParents) {
            categoryParents.forEach((cat: CategoryListGetType) => {
                if (cat.name === value) {
                    console.log(cat.childrens);
                    setCategoryChildrens(cat.childrens)
                    return;
                }
            })
        }
    }
    const handleDelete = async (id: number) => {
        try {
            const res = await deleteTopic(id);
            if (res.status == 204) {
                setIsDataUpdated((prev) => !prev);
                alert("delete successful")
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message);
            }
        }
    }
    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword)
    }

    const handleSearch = async () => {
        const res = await getTopicWithPagination(current - 1, pageSize, keyword);
        if (res && res.status === 200) {
            console.log(res);
            const content = res.data.content.map((topic: TopicType) => (
                {
                    ...topic, key: topic.id
                }
            ))
            setTopics(content);
            setCurrent(res.data.pageNum + 1);
            setPageSize(res.data.pageSize)
            setTotalElements(res.data.totalElements)
        }
    }

    useEffect(() => {
        const fetchTopics = async () => {
            const res = await getTopicWithPagination(current - 1, pageSize, null);
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
    const confirm = () => {
        form.submit()
    }

    useEffect(() => {
        dispatch(fetchCategoryParents());
    }, [])

    return (
        <div className="topic-container">
            <div className='topic-header' >
                <span>Chủ đề</span>
                <Button onClick={showDrawer} type="primary">Thêm chủ đề</Button>
            </div>
            <div className="topic-search">
                <Input placeholder="Nhập tên chủ đề" className='topic-search-input' onChange={handleChangeKeyword} value={keyword} />
                <Button className='topic-search-btn' onClick={handleSearch}>Tìm kiếm</Button>
            </div>
            <Drawer
                title={`${currentTopicId ? "Cập nhật chủ đề" : "Tạo mới chủ đề"}`}
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
                        <Button onClick={onClose}>Hủy bỏ</Button>
                        <Popconfirm
                            title="Xác nhận"
                            description="Bạn có chắc chắn muốn lưu?"
                            onConfirm={confirm}
                            onOpenChange={() => console.log('open change')}
                            disabled={pending}
                        >
                            <Button type="primary"  >
                                Xác nhận
                            </Button>
                        </Popconfirm>
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
                                label="Mô tả"
                            >
                                <TextArea rows={4} cols={24} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="parentId"
                                label="Danh mục cha"
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
                                label="Danh mục"
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
                            <Form.Item name="isPublish" label="Công khai" valuePropName="checked">
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