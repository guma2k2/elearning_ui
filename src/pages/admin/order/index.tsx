import { Button, Descriptions, DescriptionsProps, Divider, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Table, TableColumnsType } from 'antd';
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
    const [keyword, setKeyword] = useState<string>("");

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
            width: 300,
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