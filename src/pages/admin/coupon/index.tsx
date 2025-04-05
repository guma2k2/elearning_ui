import { Button, Col, DatePicker, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Space, Table, TableColumnsType } from "antd";
import { CouponPostType, CouponType } from "../../../types/CouponType";
import { useEffect, useState } from 'react';
import { deleteCoupon, getWithPagination, save, update } from "../../../services/CouponService";
import dayjs from 'dayjs';
import './CouponManagement.style.scss'
import { AxiosError } from "axios";
import { ErrorType } from "../../../types/ErrorType";
import { ADD_SUCCESS_MESSAGE, DELETE_SUCCESS_MESSAGE, UPDATE_SUCCESS_MESSAGE, showMessage } from "../../../utils/MessageUtil";
function CouponManagement() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [current, setCurrent] = useState<number>(1);
    const [currentCouponId, setCurrentCouponId] = useState<number | null>();
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [couponList, setCouponList] = useState<CouponType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setCurrentCouponId(null);
    };
    const handleUpdateCoupon = async (couponId: number) => {
        setOpen(true)
        setCurrentCouponId(couponId);
        const currentCoupon = couponList.find((item) => item.id === couponId);
        if (currentCoupon) {
            form.setFieldsValue({
                ...currentCoupon,
                startTime: dayjs(currentCoupon.startTime, 'DD/MM/YYYY HH:mm:ss'),
                endTime: dayjs(currentCoupon.endTime, 'DD/MM/YYYY HH:mm:ss'),
            })
        }
    }
    const onFinish = async (values: CouponType) => {
        const codeCoupon = values.code;
        const newValues: CouponType = {
            ...values, code: codeCoupon.trim()
        }


        setPending(true);
        const type = values.id ? "update" : "create";


        const formatedStartTime = dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss');
        const formatedEndTime = dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss');
        if (type === "create") {
            try {
                const couponPost: CouponPostType = {
                    ...newValues, startTime: formatedStartTime, endTime: formatedEndTime
                }
                console.log(couponPost);

                const resSaveUser = await save(couponPost);
                console.log(resSaveUser);
                if (resSaveUser.status === 201) {
                    form.resetFields();
                    setOpen(false);
                    showMessage(ADD_SUCCESS_MESSAGE, "success");
                }

            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    setPending(false)
                    showMessage(message, "error")
                }
            }

        } else {
            try {
                const couponId = values.id;
                const couponPost: CouponPostType = {
                    ...newValues, startTime: formatedStartTime, endTime: formatedEndTime
                }
                console.log(couponPost);

                const resUpdateUser = await update(couponPost, couponId);
                if (resUpdateUser.status === 200) {
                    form.resetFields();
                    setOpen(false)
                    showMessage(UPDATE_SUCCESS_MESSAGE, "success");
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    setPending(false)
                    showMessage(message, "error");
                }
            }
        }
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        setPending(false)
    };
    const handleChangePage = (page: PaginationProps) => {
        if (page.current && page.pageSize) {
            // console.log(page.current);
            // console.log(page.pageSize);
            setCurrent(page.current)
            setPageSize(page.pageSize)
        }
    }
    const handleDelete = async (id: number) => {
        try {
            const res = await deleteCoupon(id);
            if (res.status == 204) {
                setIsDataUpdated((prev) => !prev);
                showMessage(DELETE_SUCCESS_MESSAGE, "success");
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                showMessage(message, "error");
            }
        }
    }

    const columns: TableColumnsType<CouponType> = [
        {
            title: 'Mã',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Phần trăm khuyến mãi',
            dataIndex: 'discountPercent',
            width: 250,
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'code',
            width: 200,
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            width: 300,
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            width: 300,
        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 250,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Button type="primary" onClick={() => handleUpdateCoupon(record.id)}>Cập nhật</Button>
                    <Popconfirm
                        title="Xóa khuyến mãi này?"
                        description="Bạn có chắc chắn xóa khuyến mãi này?"
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

    const confirm = () => {
        form.submit()
    }

    useEffect(() => {
        const fetchCoupons = async () => {
            const res = await getWithPagination(current - 1, pageSize);

            if (res && res.status === 200) {
                // console.log(res);
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
            <span>Mã giảm giá</span>
            <Button onClick={showDrawer} type="primary" className="coupon-btn-add">Thêm mã giảm giá</Button>
        </div>
        <div className="coupon-search">
            <Input className='coupon-search-input' placeholder="Tìm kiếm theo mã" />
            <Button className='coupon-search-btn'>Tìm kiếm</Button>
        </div>
        <Drawer
            title={`${currentCouponId ? "Cập nhật mã giảm giá" : "Tạo mới mã giảm giá"}`}
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
                        // onOpenChange={() => console.log('open change')}
                        disabled={pending}
                    >
                        <Button type="primary" >
                            Xác nhận
                        </Button>
                    </Popconfirm>

                </Space>
            }
        >
            <Form layout="vertical" onFinish={onFinish} form={form} disabled={pending}>
                <Form.Item
                    name="id"
                    style={{ display: "none" }}
                >
                    <Input type='hidden' />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="discountPercent"
                            label="Phần trăm khuyến mãi"
                            rules={[{ required: true, message: 'Phần trăm khuyến mãi không được để trống' }]}
                        >
                            <Input type="number" placeholder="Nhập phần trăm khuyến mãi" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[{ required: true, message: 'Mã không được để trống' }]}
                        >
                            <Input placeholder="Nhập mã" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="startTime"
                            label="Thời gian bắt đầu"
                            rules={[{ required: true, message: 'Thời gian bắt đầu không được để trống' }]}
                        >
                            <DatePicker
                                showTime

                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endTime"
                            label="Thời gian kết thúc"
                            rules={[{ required: true, message: 'Thời gian kết thúc không được để trống' }]}
                        >
                            <DatePicker
                                showTime
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