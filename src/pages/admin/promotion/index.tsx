import { Button, Col, DatePicker, Drawer, Flex, Form, Input, PaginationProps, Popconfirm, Row, Space, Table, TableColumnsType } from "antd";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AxiosError } from "axios";
import { ErrorType } from "../../../types/ErrorType";
import { PromotionPostType, PromotionType } from "../../../types/PromotionType";
import { deletePromotion, getWithPagination, save, update } from "../../../services/PromotionService";
import './Promotion.style.scss'
function PromotionManagement() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [current, setCurrent] = useState<number>(1);
    const [currentPromotionId, setCurrentPromotionId] = useState<number | null>();
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [form] = Form.useForm();
    const [promotions, setPromotions] = useState<PromotionType[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setCurrentPromotionId(null);
    };
    const handleUpdateCoupon = async (promotionId: number) => {
        setOpen(true)
        setCurrentPromotionId(promotionId);
        const currentPromotion = promotions.find((item) => item.id === promotionId);
        if (currentPromotion) {
            form.setFieldsValue({
                ...currentPromotion,
                startTime: dayjs(currentPromotion.startTime, 'YYYY-MM-DD HH:mm:ss'),
                endTime: dayjs(currentPromotion.endTime, 'YYYY-MM-DD HH:mm:ss')
            })
        }
    }
    const onFinish = async (values: PromotionType) => {
        const namePromotion = values.name;
        const newValues: PromotionType = {
            ...values, name: namePromotion.trim()
        }


        setPending(true);
        const type = values.id ? "update" : "create";


        const formatedStartTime = dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss');
        const formatedEndTime = dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss');
        if (type === "create") {
            try {
                const promotionPost: PromotionType = {
                    ...newValues, startTime: formatedStartTime, endTime: formatedEndTime
                }
                console.log(promotionPost);

                const resSave = await save(promotionPost);
                if (resSave.status === 200) {
                    form.resetFields();
                    setOpen(false);
                    alert("Add successful");
                }

            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    setPending(false)
                    alert(message)
                }
            }

        } else {
            try {
                const promotionId = values.id;
                const couponPost: PromotionPostType = {
                    ...newValues, startTime: formatedStartTime, endTime: formatedEndTime
                }
                console.log(couponPost);

                const resUpdateUser = await update(couponPost, promotionId);
                if (resUpdateUser.status === 200) {
                    form.resetFields();
                    setOpen(false)
                    alert("Update successful");
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    setPending(false)
                    alert(message)

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
            const res = await deletePromotion(id);
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

    const columns: TableColumnsType<PromotionType> = [
        {
            title: 'Mã khuyến mãi',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Phần trăm khuyến mãi',
            dataIndex: 'discountPercent',
            width: 250,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
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
        const fetchPromotions = async () => {
            const res = await getWithPagination(current - 1, pageSize);

            if (res && res.status === 200) {
                // console.log(res);
                const content = res.data.content.map((promotion: PromotionType) => (
                    {
                        ...promotion, key: promotion.id
                    }
                ))
                console.log(content)
                setPromotions(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchPromotions()
    }, [current, pageSize, isDataUpdated])
    return <div className="promotion-management-container">
        <div className='promotion-header' >
            <span>Khuyến mãi</span>
            <Button onClick={showDrawer} type="primary" className="promotion-btn-add">Thêm khuyến mãi</Button>
        </div>
        <div className="promotion-search">
            <Input className='promotion-search-input' placeholder="Tìm kiếm theo tên" />
            <Button className='promotion-search-btn'>Tìm kiếm</Button>
        </div>
        <Drawer
            title={`${currentPromotionId ? "Cập nhật khuyến mãi" : "Tạo mới khuyến mãi"}`}
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
        <Table columns={columns} dataSource={promotions} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>
}

export default PromotionManagement;