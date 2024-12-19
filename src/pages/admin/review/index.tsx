import { Button, Col, Flex, Form, Input, Modal, PaginationProps, Popconfirm, Row, Select, Switch, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { ReviewGet, ReviewStatusPostType } from '../../../types/ReviewType';
import { getWithPagination, updateStatus, updateStatusReview } from '../../../services/ReviewService';
import './ReviewManagement.style.scss'
type StatusType = {
    id?: number
    status: string,
    reason: string
}
function ReviewManagement() {
    const [status, setStatus] = useState<string>("ALL");
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [reviewList, setReviewList] = useState<ReviewGet[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>();
    const [keyword, setKeyword] = useState<string>("");
    const [openStatus, setOpenStatus] = useState<boolean>(false);
    const [formStatus] = Form.useForm();


    const updateStatusReviewState = (id: number | undefined, newStatus: ReviewStatusPostType) => {
        setReviewList((prevReviews) =>
            prevReviews.map((review) =>
                review.id === id ? { ...review, status: newStatus.status, reason: newStatus.reason } : review
            )
        );
    };
    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword)
    }

    const handleSearch = async () => {
        const res = await getWithPagination(current - 1, pageSize, keyword);
        if (res && res.status === 200) {
            console.log(res);
            const content = res.data.content.map((review: ReviewGet) => (
                {
                    ...review, key: review.id
                }
            ))
            console.log(content)
            setReviewList(content);
            setCurrent(res.data.pageNum + 1);
            setPageSize(res.data.pageSize)
            setTotalElements(res.data.totalElements)
        }
    }

    const onFinishStatus = async (values: StatusType) => {
        console.log(values);

        const body: ReviewStatusPostType = {
            status: "UNPUBLISHED",
            reason: values.reason
        }
        const resUpdate = await updateStatusReview(body, values.id);
        if (resUpdate.status === 204) {
            updateStatusReviewState(values.id, body)
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
            const body: ReviewStatusPostType = {
                status: checked,
                reason: ""
            }
            const resUpdate = await updateStatusReview(body, id);
            if (resUpdate.status === 204) {
                updateStatusReviewState(id, body)
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
        const fetchReviews = async () => {
            const res = await getWithPagination(current - 1, pageSize, null);

            if (res && res.status === 200) {
                console.log(res);
                const content = res.data.content.map((review: ReviewGet) => (
                    {
                        ...review, key: review.id
                    }
                ))
                console.log(content)
                setReviewList(content);
                setCurrent(res.data.pageNum + 1);
                setPageSize(res.data.pageSize)
                setTotalElements(res.data.totalElements)
            }
        }
        fetchReviews()
    }, [current, pageSize, isDataUpdated])


    const columns: TableColumnsType<ReviewGet> = [
        {
            title: 'Mã đánh giá',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Số sao',
            dataIndex: 'ratingStar',
            width: 120,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            width: 200,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
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
            title: 'Thời gian cập nhật',
            dataIndex: 'updatedAt',
            width: 200,
        },
        {
            title: 'Học sinh',
            dataIndex: 'key',
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <span>{record.student.email}</span>
                </Flex>
            ),
        },
        {
            title: 'Khóa học',
            dataIndex: 'key',
            width: 300,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <span>{record.course.title}</span>
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
    return <div className="review-management-container">
        <div className='review-header' >
            <span>Đánh giá</span>
        </div>
        <div className="review-search">
            <Input placeholder='Nhập nội dung đánh giá' className='review-search-input' onChange={handleChangeKeyword} value={keyword} />
            <Button className='review-search-btn' onClick={handleSearch}>Tìm kiếm</Button>
            <div className="course-search-status" style={{ marginLeft: "20px" }}>
                <Select

                    value={status}
                    onChange={(value) => {
                        alert(value);
                        setStatus(value);
                    }}
                    style={{ width: "250px", height: "100%" }}
                >
                    <Select.Option value="ALL">Chọn trạng thái muốn tìm kiếm</Select.Option>
                    <Select.Option value="PUBLISHED">Công khai</Select.Option>
                    <Select.Option value="UNPUBLISHED">Không công khai</Select.Option>
                    <Select.Option value="UNDER_REVIEW">ĐANG ĐÁNH GIÁ</Select.Option>
                </Select>
            </div>
        </div>
        <Table columns={columns} dataSource={reviewList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>;
}

export default ReviewManagement;