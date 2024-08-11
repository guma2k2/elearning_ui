import { Button, Col, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Switch, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import './Category.style.scss'
import TextArea from "antd/es/input/TextArea";
import { deleteCategory, get, getWithPagination, save, update } from "../../../services/CategoryService";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchCategoryParents } from "../../../redux/slices/CategorySlice";
import { AxiosError } from "axios";
import { ErrorType } from "../../../types/ErrorType";

function Category() {
    const [open, setOpen] = useState<boolean>(false);
    const [pending, setPending] = useState(false);
    const { categoryParents } = useAppSelector((state) => state.categories);
    const dispatch = useAppDispatch();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentCatId, setCurrentCatId] = useState<number | null>();
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [form] = Form.useForm();
    const handleUpdateStatusCateogry = async (checked: boolean, id: number) => {
        const res = await get(id)
        if (res && res.status === 200) {
            const data = res.data as CategoryType
            const parentId = res.data.parentId == -1 ? '' : res.data.parentId;

            const categoryPut = {
                ...data, isPublish: checked, parentId
            }
            console.log(checked);
            console.log(categoryPut);

            const resOfUpdate = await update(categoryPut, id);
            console.log(resOfUpdate);
            setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        }
    }
    const handleDelete = async (id: number) => {
        try {
            const res = await deleteCategory(id);
            if (res.status == 204) {
                setIsDataUpdated((prev) => !prev);
                alert("Delete successful")
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
    const columns: TableColumnsType<CategoryType> = [
        {
            title: 'Mã danh mục',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            width: 200,
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
            render: (_text, record) => {
                console.log(record.isPublish);

                return <Flex gap="small" wrap="wrap">
                    <Switch checkedChildren="published" unCheckedChildren="unpublished" checked={record.isPublish} onChange={(checked: boolean) => handleUpdateStatusCateogry(checked, record.id)} />
                </Flex>
            }
            ,
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
                    <Button type="primary" onClick={() => handleUpdateCategory(record.id)}>Cập nhật</Button>
                    <Popconfirm
                        title="Xóa danh mục này?"
                        description="Bạn có chắc chắn muốn xóa danh mục này"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger >Xóa</Button>
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
        setCurrentCatId(null);
    };
    const onFinish = async (values: CategoryType) => {
        console.log(values);
        setPending(true)
        const type = currentCatId ? "update" : "create";
        if (type === "create") {
            try {
                const resSave = await save(values);
                console.log(resSave);
                if (resSave.status === 201) {
                    form.resetFields();
                    setOpen(false);
                    alert("Add category successful")
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
                const id = currentCatId;
                if (id) {
                    const resUpdateUser = await update(values, id);
                    if (resUpdateUser.status === 204) {
                        form.resetFields();
                        setOpen(false)
                        alert("Update category successful")
                    }
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
    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword)
    }
    const handleSearch = async () => {
        const res = await getWithPagination(current - 1, pageSize, keyword);
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

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getWithPagination(current - 1, pageSize, null);
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
    const confirm = () => {
        form.submit()
    }

    useEffect(() => {
        dispatch(fetchCategoryParents())
    }, [])

    return (
        <div className="category-container">
            <div className='category-header' >
                <span>Danh mục</span>
                <Button onClick={showDrawer} type="primary">Thêm danh mục</Button>
            </div>
            <div className="category-search">
                <Input className='category-search-input' onChange={handleChangeKeyword} value={keyword} placeholder="Nhập tên danh mục" />
                <Button className='category-search-btn' onClick={handleSearch}>Tìm kiếm</Button>
            </div>
            <Drawer
                title={`${currentCatId ? "Cập nhật danh mục" : "Thêm mới danh mục"}`}
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
                        <Button onClick={onClose}>Hủy</Button>
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
                                label="Tên danh mục"
                                rules={[{ required: true, message: 'Tên danh mục không được bỏ trống' }]}
                            >
                                <Input placeholder="Nhập tên danh mục" />
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
                                <Select  >
                                    <Select.Option value={""}>Chọn danh mục cha</Select.Option>
                                    {categoryParents && categoryParents.map((cat) => {
                                        return <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="isPublish" label="Trạng thái" valuePropName="checked">
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
