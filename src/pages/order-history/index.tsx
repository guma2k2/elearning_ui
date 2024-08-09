import { useEffect, useState } from 'react';
import './OrderHistory.style.scss'
import { OrderDetailType, OrderType } from '../../types/OrderType';
import { Button, Descriptions, Divider, Drawer, Flex, PaginationProps, Table, TableColumnsType } from 'antd';
import { getOrdersByUser } from '../../services/OrderService';
function OrderHistory() {
    const [open, setOpen] = useState(false);
    const [orderList, setOrderList] = useState<OrderType[]>([]);
    const [currentOrder, setCurrentOrder] = useState<OrderType>();

    const handleShowDetailOrder = (orderId: number) => {
        setOpen(true);
        const order = orderList.find((order) => order.id === orderId)
        if (order) {
            const content = order.orderDetails.map((item: OrderDetailType) => (
                {
                    ...item, key: item.id
                }
            ));
            setCurrentOrder({
                ...order, orderDetails: content
            });
        }
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await getOrdersByUser();
            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.map((order: OrderType) => (
                    {
                        ...order, key: order.id
                    }
                ))
                setOrderList(content);
            }
        }
        fetchOrders()
    }, [])


    const columns: TableColumnsType<OrderType> = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            width: 130,
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'coupon',
            width: 150,
        },
        {
            title: 'Thời giao tạo',
            dataIndex: 'createdAt',
            width: 250,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 100,
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
                    <Button type="primary" onClick={() => handleShowDetailOrder(record.id)}>Detail</Button>
                </Flex>
            ),
        },
    ];


    const columnsOrderDetails: TableColumnsType<OrderDetailType> = [
        {
            title: 'Mã chi tiết',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Tiêu đề khóa học',
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
            title: 'Gia tien',
            dataIndex: 'price',
            width: 50,
        },
    ];

    return <div className="order-history-container">
        <h2 className="order-history-header">Lịch sử mua hàng</h2>
        <div className="order-history-wrapper">
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
                    <Descriptions.Item label="Email">{currentOrder?.student}</Descriptions.Item>
                    <Descriptions.Item label="Khuyến mãi">{currentOrder?.coupon}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian tạo">{currentOrder?.createdAt}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">{currentOrder?.totalPrice}</Descriptions.Item>
                </Descriptions>
                <Divider> Chi tiết đơn hàng </Divider>
                <Table columns={columnsOrderDetails} dataSource={currentOrder?.orderDetails} />
            </Drawer>
            <Table columns={columns} dataSource={orderList} scroll={{ x: 1000 }} />
        </div>
    </div>;
}

export default OrderHistory;