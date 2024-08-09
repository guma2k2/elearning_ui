import { Button, Flex, Input, PaginationProps, Switch, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { ReviewGet } from '../../../types/ReviewType';
import { getWithPagination, updateStatus } from '../../../services/ReviewService';
import './ReviewManagement.style.scss'
function ReviewManagement() {
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [reviewList, setReviewList] = useState<ReviewGet[]>([]);
    const [isDataUpdated, setIsDataUpdated] = useState<boolean>();
    const [keyword, setKeyword] = useState<string>("");

    const handleUpdateStatus = async (checked: boolean, id: number) => {
        const res = await updateStatus(checked, id);
        if (res.status === 204) {
            setIsDataUpdated((prev) => !prev);
        }
    }
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
            width: 100,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Switch checkedChildren="active" unCheckedChildren="unactive" checked={record.status} onChange={(checked: boolean) => handleUpdateStatus(checked, record.id)} />
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
        </div>
        <Table columns={columns} dataSource={reviewList} pagination={{ defaultPageSize: pageSize, defaultCurrent: current, total: totalElements, showSizeChanger: true }} scroll={{ x: 1000 }} onChange={(page) => handleChangePage(page)} />
    </div>;
}

export default ReviewManagement;