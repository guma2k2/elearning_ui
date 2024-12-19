import { Button, Col, Descriptions, DescriptionsProps, Divider, Drawer, Flex, Form, Input, Modal, PaginationProps, Popconfirm, Row, Select, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { OrderDetailType, OrderStatusPostType, OrderType } from '../../../types/OrderType';
import './OrderManagement.style.scss'
import { getOrderWithPagination, updateStatusOrder } from '../../../services/OrderService';


type StatusType = {
    id?: number
    status: string,
    reason: string
}
function OrderManagement() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [orderList, setOrderList] = useState<OrderType[]>([]);
    const [keyword, setKeyword] = useState<string>("");

    const [currentOrder, setCurrentOrder] = useState<OrderType>();

    const [openStatus, setOpenStatus] = useState<boolean>(false);
    const [formStatus] = Form.useForm();
    const handleShowDetailOrder = (orderId: number) => {
        setOpen(true);
        const order = orderList.find((order) => order.id === orderId)
        setCurrentOrder(order);
    };

    const onClose = () => {
        setOpen(false);
    };

    const updateOrderStatus = (id: number | undefined, newStatus: OrderStatusPostType) => {
        setOrderList((prevOrders) =>
            prevOrders.map((order) =>
                order.id === id ? { ...order, status: newStatus.status, reason: newStatus.reason } : order
            )
        );
    };

    const onFinishStatus = async (values: StatusType) => {
        console.log(values);

        const body: OrderStatusPostType = {
            status: "UNPUBLISHED",
            reason: values.reason
        }
        const resUpdate = await updateStatusOrder(body, values.id);
        if (resUpdate.status === 204) {
            updateOrderStatus(values.id, body)
            alert("success");
            setOpenStatus(false);
        }
    }

    const handleUpdateStatus = async (checked: string, id: number) => {
        if (checked === "UNPUBLISHED") {
            formStatus.setFieldsValue({
                id: id,
            })
            setOpenStatus(true);
        } else {
            const body: OrderStatusPostType = {
                status: checked,
                reason: ""
            }
            const resUpdate = await updateStatusOrder(body, id);
            if (resUpdate.status === 204) {
                updateOrderStatus(id, body)
                alert("success");
            }
        }
    }
    const handleOkStatus = () => {
        // setConfirmLoading(true);
        formStatus.submit()
    };

    const handleCancelStatus = () => {
        formStatus.resetFields()
        setOpenStatus(false);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getOrderWithPagination(current - 1, pageSize, null);

            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((order: OrderType) => (
                    {
                        ...order, key: order.id
                    }
                ))
                setOrderList(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchUsers()
    }, [current, pageSize])
    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword)
    }




    const handleSearch = async () => {
        const res = await getOrderWithPagination(current - 1, pageSize, keyword);

        if (res && res.status === 200) {
            console.log(res);
            const content = res.data.content.map((order: OrderType) => (
                {
                    ...order, key: order.id
                }
            ))
            setOrderList(content);
            setCurrent(res.data.pageNum + 1);
            setPageSize(res.data.pageSize)
            setTotalElements(res.data.totalElements)
        }
    }

    const columns: TableColumnsType<OrderType> = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Học sinh',
            dataIndex: 'student',
            width: 150,
        },
        {
            title: 'Coupon',
            dataIndex: 'coupon',
            width: 150,
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            width: 200,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 300,
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
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            width: 200,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleShowDetailOrder(record.id)}>Chi tiết</Button>
                </Flex>
            ),
        },
    ];


    const columnsOrderDetails: TableColumnsType<OrderDetailType> = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'course_title',
            width: 150,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <span>{record.course.title}</span>
                </Flex>
            ),
        },
        {
            title: 'Ảnh khóa học',
            dataIndex: 'course_image',
            width: 150,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <img style={{ width: "30px", height: "30px", objectFit: "cover" }} src={record.course.image} alt="course-image" />
                </Flex>
            ),
        },
        {
            title: 'Gía tiền',
            dataIndex: 'price',
            width: 50,
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
    return <div className="order-management-container">
        <div className='order-header' >
            <span>Đơn hàng</span>
        </div>
        <div className="order-search">
            <Input className='order-search-input' placeholder='Nhập mã đơn hàng' onChange={handleChangeKeyword} value={keyword} />
            <Button className='order-search-btn' onClick={handleSearch}>Tìm kiếm</Button>
        </div>
        <Drawer
            title="Thông tin đơn hàng"
            placement={"right"}
            closable={true}
            onClose={onClose}
            open={open}
            width={"50%"}
        >
            <Descriptions layout="vertical" bordered >
                <Descriptions.Item label="Mã đơn hàng">{currentOrder?.id}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ email khách hàng">{currentOrder?.student}</Descriptions.Item>
                <Descriptions.Item label="Khuyến mãi">{currentOrder?.coupon}</Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo">{currentOrder?.createdAt}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{currentOrder?.totalPrice}</Descriptions.Item>
            </Descriptions>
            <Divider> Chi tiết đơn hàng </Divider>
            <Table columns={columnsOrderDetails} dataSource={currentOrder?.orderDetails} />
        </Drawer>
        <Table columns={columns} dataSource={orderList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>;
}

export default OrderManagement;