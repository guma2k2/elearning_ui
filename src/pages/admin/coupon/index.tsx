import { Button, Col, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Table, TableColumnsType } from "antd";
import { CouponType } from "../../../types/CouponType";
import { useEffect, useState } from 'react';
import { getWithPagination } from "../../../services/CouponService";
import './CouponManagement.style.scss'
function CouponManagement() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [currentCoupon, setCurrenCoupon] = useState<CouponType>();
    const [couponList, setCouponList] = useState<CouponType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setCurrenCoupon(undefined)
        setImageUrl("")
    };
    const handleUpdateCoupon = async (couponId: number) => {
        // console.log(userId);
        // setOpen(true)
        // const res = await get(userId)
        // if (res && res.status === 200) {
        //     const newCurrentUser = res.data;
        //     setCurrentUser(res.data);
        //     form.setFieldsValue({
        //         ...newCurrentUser,
        //         day: newCurrentUser.dateOfBirth.split("-")[2],
        //         month: newCurrentUser.dateOfBirth.split("-")[1],
        //         year: newCurrentUser.dateOfBirth.split("-")[0],
        //     })
        //     setImageUrl(newCurrentUser.photoURL);
        // }
    }
    const onFinish = async (values: CouponType) => {
        setPending(true);
        console.log(values);
        const type = currentCoupon ? "update" : "create";
        // let photo = "";
        // if (checkIsUploadFile) {
        //     var formData = new FormData();
        //     formData.append("photo", values.photo[0].originFileObj);
        //     formData.append("type", "photo");
        //     const res = await uploadFile(formData);
        //     if (res.status === 200) {
        //         photo = res.data.url;
        //     }
        // }
        // values = { ...values, photo: photo }
        // console.log(values);
        // if (type === "create") {
        //     const resSaveUser = await save(values);
        //     console.log(resSaveUser);
        //     if (resSaveUser.status === 201) {
        //         form.resetFields();
        //         setOpen(false);
        //     }
        // } else {
        //     const userId = currentUser?.id;
        //     if (checkIsChangePassword === false) {
        //         values = { ...values, password: "" }
        //     }
        //     const resUpdateUser = await update(values, userId);
        //     if (resUpdateUser.status === 204) {
        //         form.resetFields();
        //         setOpen(false)
        //     }
        // }
        // setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        // setPending(false)
    };
    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
            console.log(page.current);
            console.log(page.pageSize);
            setCurrent(page.current)
            setPageSize(page.pageSize)
        }
    }

    const columns: TableColumnsType<CouponType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Discount percent',
            dataIndex: 'discountPercent',
            width: 250,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            width: 200,
        },
        {
            title: 'Start time',
            dataIndex: 'startTime',
            width: 200,
        },
        {
            title: 'End time',
            dataIndex: 'endTime',
            width: 100,
        },
        {
            title: 'Action',
            dataIndex: 'key',
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateCoupon(record.id)}>Edit</Button>
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

    useEffect(() => {
        // const fetchCoupons = async () => {
        //     const res = await getWithPagination(current - 1, pageSize);

        //     if (res && res.status === 200) {
        //         console.log(res);
        //         const content = res.data.content.map((user: CouponType) => (
        //             {
        //                 ...user, key: user.id
        //             }
        //         ))
        //         console.log(content)
        //         setCouponList(content);
        //         setCurrent(res.data.pageNum + 1);
        //         setPageSize(res.data.pageSize)
        //         setTotalElements(res.data.totalElements)
        //     }
        // }
        // fetchCoupons()
    }, [current, pageSize, isDataUpdated])
    return <div className="coupon-management-container">
        <div className='coupon-header' >
            <span>Coupon</span>
            <Button onClick={showDrawer} type="primary">Add coupon</Button>
        </div>
        <Drawer
            title="Create a new coupon"
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
                    <Button type="primary" onClick={() => form.submit()} disabled={pending} loading={pending}>
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" onFinish={onFinish} form={form} disabled={pending}>
                <Form.Item
                    name="id"
                    style={{ display: "none" }}
                >
                    <Input placeholder="Please enter user name" type='hidden' />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="discountPercent"
                            label="Discount percent"
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input placeholder="Please enter user name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input placeholder="Please enter user name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="startTime"
                            label="Start time"
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input placeholder="Please enter user name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endTime"
                            label="End time"
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input placeholder="Please enter user name" />
                        </Form.Item>
                    </Col>
                </Row>


            </Form>
        </Drawer>
        <Table columns={columns} dataSource={couponList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>
}

export default CouponManagement;