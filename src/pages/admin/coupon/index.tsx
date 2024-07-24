import { Button, Col, DatePicker, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Space, Table, TableColumnsType } from "antd";
import { CouponPostType, CouponType } from "../../../types/CouponType";
import { useEffect, useState } from 'react';
import { getWithPagination, save, update } from "../../../services/CouponService";
import dayjs from 'dayjs';
import './CouponManagement.style.scss'
function CouponManagement() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [currentCoupon, setCurrenCoupon] = useState<CouponType>();
    const [couponList, setCouponList] = useState<CouponType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string>();
    const [endTime, setEndTime] = useState<string>();
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setCurrenCoupon(undefined)
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
    const onFinish = async (values: CouponPostType) => {
        setPending(true);
        console.log(values);
        const type = currentCoupon ? "update" : "create";

        console.log(dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss'));


        const formatedStartTime = dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss');
        const formatedEndTime = dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss');
        if (type === "create") {
            const couponPost: CouponPostType = {
                ...values, startTime: formatedStartTime, endTime: formatedEndTime
            }
            const resSaveUser = await save(couponPost);
            console.log(resSaveUser);
            if (resSaveUser.status === 201) {
                form.resetFields();
                setOpen(false);
            }
        } else {
            const couponId = currentCoupon?.id;
            const couponPost: CouponPostType = {
                ...values, startTime: formatedStartTime, endTime: formatedEndTime
            }
            const resUpdateUser = await update(couponPost, couponId);
            if (resUpdateUser.status === 204) {
                form.resetFields();
                setOpen(false)
            }
        }
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        setPending(false)
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
            width: 150,
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
            width: 200,
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
        const fetchCoupons = async () => {
            const res = await getWithPagination(current - 1, pageSize);

            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((coupon: CouponType) => (
                    {
                        ...coupon, key: coupon.id
                    }
                ))
                console.log(content)
                setCouponList(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchCoupons()
    }, [current, pageSize, isDataUpdated])
    return <div className="coupon-management-container">
        <div className='coupon-header' >
            <span>Coupon</span>
            <Button onClick={showDrawer} type="primary" className="coupon-btn-add">Add coupon</Button>
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
                            <Input type="number" placeholder="Please enter discount percent" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[{ required: true, message: 'Please enter code' }]}
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
                            <DatePicker
                                showTime
                                onChange={(value, dateString) => {
                                    console.log('Selected Time: ', value);
                                    setStartTime(dateString)
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endTime"
                            label="End time"
                            rules={[{ required: true, message: 'Please enter end time' }]}
                        >
                            <DatePicker
                                showTime
                                onChange={(value, dateString) => {
                                    console.log('Selected Time: ', value);
                                    setEndTime(dateString)
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>


            </Form>
        </Drawer>
        <Table columns={columns} dataSource={couponList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>
}

export default CouponManagement;