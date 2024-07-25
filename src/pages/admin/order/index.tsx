import { Button, Descriptions, DescriptionsProps, Divider, Drawer, Flex, Form, PaginationProps, Popconfirm, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { OrderDetailType, OrderType } from '../../../types/OrderType';
import './OrderManagement.style.scss'
import { getOrderWithPagination } from '../../../services/OrderService';
function OrderManagement() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [orderList, setOrderList] = useState<OrderType[]>([]);

    const [currentOrder, setCurrentOrder] = useState<OrderType>();

    const handleShowDetailOrder = (orderId: number) => {
        setOpen(true);
        const order = orderList.find((order) => order.id === orderId)
        setCurrentOrder(order);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getOrderWithPagination(current - 1, pageSize);

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


    const columns: TableColumnsType<OrderType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Student',
            dataIndex: 'student',
            width: 150,
        },
        {
            title: 'Coupon',
            dataIndex: 'coupon',
            width: 150,
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            width: 300,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
        },
        {
            title: 'Total price',
            dataIndex: 'totalPrice',
            width: 200,
        },
        {
            title: 'Action',
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
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Ten khoa hoc',
            dataIndex: 'course_title',
            width: 150,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <span>{record.course.title}</span>
                </Flex>
            ),
        },
        {
            title: 'Anh khoa hoc',
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
            <span>Order</span>
        </div>
        <Drawer
            title="Thong tin don hang"
            placement={"right"}
            closable={true}
            onClose={onClose}
            open={open}
            width={"50%"}
        >
            <Descriptions layout="vertical" bordered >
                <Descriptions.Item label="Ma don hang">{currentOrder?.id}</Descriptions.Item>
                <Descriptions.Item label="Email">{currentOrder?.student}</Descriptions.Item>
                <Descriptions.Item label="Coupon">{currentOrder?.coupon}</Descriptions.Item>
                <Descriptions.Item label="Thoi gian tao">{currentOrder?.createdAt}</Descriptions.Item>
                <Descriptions.Item label="Tong tien">{currentOrder?.totalPrice}</Descriptions.Item>
            </Descriptions>
            <Divider> Chi tiet don hang </Divider>
            <Table columns={columnsOrderDetails} dataSource={currentOrder?.orderDetails} />
        </Drawer>
        <Table columns={columns} dataSource={orderList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>;
}

export default OrderManagement;