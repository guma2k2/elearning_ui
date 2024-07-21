import { Button, Flex, Form, PaginationProps, Popconfirm, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { OrderType } from '../../../types/OrderType';
import './OrderManagement.style.scss'
function OrderManagement() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [currentStudent, setCurrentUser] = useState<OrderType>();
    const [userList, setUserList] = useState<OrderType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);

    useEffect(() => {
        // const fetchUsers = async () => {
        //     const res = await getWithPagination(current - 1, pageSize);

        //     if (res && res.status === 200) {
        //         console.log(res);
        //         const content = res.data.content.map((user: UserType) => (
        //             {
        //                 ...user, key: user.id
        //             }
        //         ))
        //         console.log(content)
        //         setUserList(content);
        //         setCurrent(res.data.pageNum + 1);
        //         setPageSize(res.data.pageSize)
        //         setTotalElements(res.data.totalElements)
        //     }
        // }
        // fetchUsers()
    }, [current, pageSize, isDataUpdated])


    const columns: TableColumnsType<OrderType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Student',
            dataIndex: 'student',
            width: 250,
        },
        {
            title: 'Coupon',
            dataIndex: 'coupon',
            width: 200,
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            width: 200,
        },
        {
            title: 'Status',
            dataIndex: 'updatedAt',
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
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary">Edit</Button>
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
        <Table columns={columns} dataSource={userList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>;
}

export default OrderManagement;