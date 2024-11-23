import './ClassroomDetail.style.scss'
import Background from "../../../assets/img_classroom_background.jpg"
import { Button, Card, Col, DatePicker, Form, Input, Modal, Rate, Row, Select, Tabs } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ClassroomGetType, MeetingPostType, ReferenceFileType, ReferencePostType } from '../../../types/ClassroomType';
import { useEffect, useState } from 'react';
import { getById } from '../../../services/ClassroomService';
import { downloadFile } from '../../../services/MediaService';
import { formatDate } from '../../../utils/Format';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import dayjs from 'dayjs';

import StarIcon from '../../../assets/star.png'
import { ReviewClassroomGet, ReviewClassroomPost } from '../../../types/ReviewClassroomType';
import { createReview, getByClassroomId, getByStudent, updateReview } from '../../../services/ReviewClassroomService';
import Review from '../../../components/review';
import TextArea from 'antd/es/input/TextArea';
import { createMeeting, updateMeeting } from '../../../services/MeetingService';
import { createReference, updateReference } from '../../../services/ReferenceService';


type ToggleType = {
    type: "meeting" | "reference" | ""
}
function ClassroomDetail() {
    let { id, courseId } = useParams();
    const navigate = useNavigate();
    const [classroomGet, setClassroomGet] = useState<ClassroomGetType>();
    const [formClassroom] = Form.useForm();
    const [toggle, setToggle] = useState<ToggleType>({ type: "" });
    const [isModalClassroom, setIsModalClassroom] = useState(false);

    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false)

    const [reviews, setReviews] = useState<ReviewClassroomGet[]>([]);

    const [review, setReview] = useState<ReviewClassroomGet | null>(null);

    const [eventId, setEventId] = useState<number>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ratingText, setRatingText] = useState<string>("Tuyệt vời, trên cả mong đợi!");
    const [form] = Form.useForm();
    const handleOkClassroom = () => {
        formClassroom.submit()
        setIsModalClassroom(false);
    };
    const handleCancelClassroom = () => {
        setIsModalClassroom(false);
    };
    const showModalClassroom = () => {
        setIsModalClassroom(true);
    };

    const navigateToMeetingRoom = (code: string) => {
        navigate(`/meeting/${code}`)
    }

    const navigateClassrooms = () => {
        navigate(`/classrooms/course/${courseId}`)
    }

    const handleDownloadFile = async (file: ReferenceFileType) => {
        try {
            const blob = await downloadFile(file);
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary anchor element
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();

            // Clean up the URL and remove the anchor element
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const fetchClassroomById = async () => {
        const res = await getById(id);
        console.log(res);
        if (res.status === 200) {
            const classroom = res.data as ClassroomGetType
            console.log(classroom);
            setClassroomGet(classroom);
        }
    }

    const fetchReviewsClassroomById = async () => {
        const res = await getByClassroomId(id);
        console.log(res);
        if (res.status === 200) {
            const reviews = res.data as ReviewClassroomGet[]
            setReviews(reviews);
        }
    }

    const fetchReviewByStudent = async () => {
        const res = await getByStudent();
        console.log(res);
        if (res.status === 200) {
            const review = res.data as ReviewClassroomGet
            setReview(review);
        } else {
            setReview(null)
        }
    }
    const hanldeHoverChange = (value: number) => {
        console.log(value);
        switch (value) {
            case 5:
                setRatingText("Tuyệt vời, trên cả mong đợi!")
                break;
            case 4.5:
                setRatingText("Tốt/Tuyệt vời")
                break;
            case 4:
                setRatingText("Tốt, như tôi mong đợi")
                break;
            case 3.5:
                setRatingText("Trung bình/Tốt")
                break;
            case 3:
                setRatingText("Trung bình, lẽ ra có thể hay hơn")
                break;
            case 2.5:
                setRatingText("Kém/Trung bình")
                break;
            case 2:
                setRatingText("Kém, khá thất vọng")
                break;
            case 1.5:
                setRatingText("Rất tệ/Kém")
                break;
            case 1:
                setRatingText("Rất tệ, hoàn toàn không như tôi mong đợi")
                break;

            default:
                break;
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // setIsModalOpen(false);
        form.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        // setClassroomId(null);
        // setImageUrl("")
    };

    const onFinish = async (values: ReviewClassroomPost) => {
        console.log('Received values of form: ', values);

        const type: string = review ? "update" : "create";
        console.log(type);
        console.log(id);

        if (id) {
            console.log(parseInt(id));

            const body: ReviewClassroomPost = {
                ...values,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createReview(body);
                if (res.status == 200) {
                    const newOrUpdatedReview = res.data as ReviewClassroomGet
                    setReview(review)
                    setReviews((prevReviews) => {
                        const exists = prevReviews.some(
                            (review) => review.id === newOrUpdatedReview.id
                        );
                        if (exists) {
                            // Update the existing review
                            return prevReviews.map((review) =>
                                review.id === newOrUpdatedReview.id ? newOrUpdatedReview : review
                            );
                        } else {
                            // Add the new review
                            return [...prevReviews, newOrUpdatedReview];
                        }
                    });
                }
            } else {
                if (review) {
                    const reviewId = review.id;
                    const res = await updateReview(body, reviewId);
                    if (res.status == 200) {
                        const newOrUpdatedReview = res.data as ReviewClassroomGet
                        setReview(review)
                        setReviews((prevReviews) => {
                            const exists = prevReviews.some(
                                (review) => review.id === newOrUpdatedReview.id
                            );
                            if (exists) {
                                // Update the existing review
                                return prevReviews.map((review) =>
                                    review.id === newOrUpdatedReview.id ? newOrUpdatedReview : review
                                );
                            } else {
                                // Add the new review
                                return [...prevReviews, newOrUpdatedReview];
                            }
                        });
                    }
                }
            }
        }
    };


    const onFinishMeeting = async (values: MeetingPostType) => {
        console.log('Received values of form: ', values);

        const type: string = eventId ? "update" : "create";

        const formatedStartTime = dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss');
        const formatedEndTime = dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss');
        console.log(type);

        if (id) {
            console.log(parseInt(id));

            const body: MeetingPostType = {
                ...values,
                startTime: formatedStartTime,
                endTime: formatedEndTime,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createMeeting(body);
                if (res.status == 200) {

                }
            } else {
                if (eventId) {
                    const res = await updateMeeting(body, eventId);
                    if (res.status == 200) {

                    }
                }
            }
        }
    };

    const onFinishFolder = async (values: ReferencePostType) => {
        console.log('Received values of form: ', values);

        const type: string = eventId ? "update" : "create";
        console.log(type);
        console.log(id);

        if (id) {
            console.log(parseInt(id));

            const body: ReferencePostType = {
                ...values,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createReference(body);
                if (res.status == 200) {

                }
            } else {
                if (eventId) {
                    const res = await updateReference(body, eventId);
                    if (res.status == 200) {

                    }
                }
            }
        }
    };
    const handleChange = (value: "meeting" | "reference") => {
        console.log(`selected ${value}`);
        setToggle({ type: value })
    };
    useEffect(() => {
        fetchClassroomById();
        fetchReviewsClassroomById();
        fetchReviewByStudent();
    }, [id])

    return <div className="classroomDetail-container">
        <div className="classroomDetail-top">
            <MdOutlineKeyboardArrowLeft onClick={navigateClassrooms} className="classromDetail-back" />
            <img src={Background} alt="classroom detail" />
            <div className="classroomDetail-text">
                <div className="classroomDetail-Title">{classroomGet?.name}</div>
                <div className="classroomDetail-Desc">{classroomGet?.description}</div>
                <Button>Them ctlh</Button>
            </div>

            <Modal title="Tạo lớp học" open={isModalClassroom} onOk={handleOkClassroom} onCancel={handleCancelClassroom} >
                <Select
                    onChange={handleChange}
                    style={{
                        width: "100%",
                    }}
                    disabled
                    options={[
                        {
                            value: 'meeting',
                            label: 'Meeting',
                        },
                        {
                            value: 'reference',
                            label: 'Reference',
                        },
                    ]}
                />
                {toggle?.type == "meeting" ? <Form layout="horizontal" onFinish={onFinishMeeting} form={form} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} style={{ maxWidth: "100%" }} >
                    <Form.Item
                        name="id"
                        style={{ display: "none" }}
                    >
                        <Input placeholder="id" type='hidden' />
                    </Form.Item>

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
                </Form> :
                    <Form layout="horizontal" onFinish={onFinishFolder} form={form} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} style={{ maxWidth: "100%" }} >
                        <Form.Item
                            name="id"
                            style={{ display: "none" }}
                        >
                            <Input placeholder="id" type='hidden' />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Mô tả thu muc"
                                >
                                    <TextArea placeholder="Nhập mô tả lớp học" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>}
            </Modal>
        </div>
        <Tabs
            tabPosition={'left'}
            items={new Array(2).fill(null).map((_, i) => {
                const id = String(i + 1);
                if (id == "1") {
                    return {
                        label: 'Chi tiết lớp học',
                        key: id,
                        children: <div className="classroomDetail-content">
                            {classroomGet && classroomGet.events.map((event) => {
                                if (event.type == "meeting") {
                                    return <Card
                                        key={`meeting-${event.id}`}
                                        style={{ width: "780px", padding: "0 40px" }}
                                    >
                                        <div className="classroomDetail-card-top" style={{ display: "flex", gap: "15px" }}>
                                            <img src="https://lh3.googleusercontent.com/a/ACg8ocLf5401BY_QkReNX4ZNaR6_hs5i0n_rgUA7Zrf9z6EQd5ukMw=s40-c-mo" alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                            <div className="classroomDetail-card-top-right">
                                                <div>Giáo viên đã đăng thông tin cho một cuộc họp</div>
                                                <div>{formatDate(event.createdAt)}</div>
                                            </div>
                                            <Button onClick={() => navigateToMeetingRoom(event.code)}>Tham gia cuộc họp</Button>
                                        </div>
                                    </Card>
                                }
                                return <Card
                                    key={`document-${event.id}`}
                                    style={{ width: "780px", padding: "20px 40px" }}
                                >
                                    <div className="classroomDetail-card-top" style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
                                        <img src="https://lh3.googleusercontent.com/a/ACg8ocLf5401BY_QkReNX4ZNaR6_hs5i0n_rgUA7Zrf9z6EQd5ukMw=s40-c-mo" alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                        <div className="classroomDetail-card-top-right">
                                            <div>Giáo viên</div>
                                            <div>{formatDate(event.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div className="classroomDetail-card-middle" style={{ margin: "10px 0" }}>{event.description}</div>
                                    <div className="classroomDetail-card-bottom" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                        {event.type == "reference" && event.files.length > 0 && event.files.map((file) => {
                                            return <Card style={{ width: "calc(50% - 20px)", cursor: "pointer" }} key={`file-${file.id}`} onClick={() => handleDownloadFile(file)} >
                                                <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                                                    <img style={{ flex: "4", height: "70px", objectFit: "cover" }} src={file.fileUrl} alt="" />
                                                    <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                                        <div>{file.fileName}</div>
                                                    </div>
                                                </div>
                                            </Card>
                                        })}

                                    </div>
                                </Card>
                            })}


                        </div>,
                    };
                }
                return {
                    label: 'Đánh giá lớp học',
                    key: id,
                    children: <div className="classroomDetail-content">
                        <div className="review-header">
                            <div className="review-total-rating">
                                <img src={StarIcon} alt="star icon" />
                                <span>4,5 xếp hạng khóa học</span>
                            </div>
                            <span>({reviews.length} xếp hạng)</span>
                        </div>

                        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} rootClassName="review-modal" okText={"Lưu và tiếp tục"}>
                            <h1>Vì sao bạn xếp hạng ở mức này?</h1>
                            <span className="review-modal-rating-text">{ratingText}</span>
                            <Form
                                form={form}
                                name="validate_other"
                                onFinish={onFinish}
                                style={{ width: "100%" }}
                                initialValues={{
                                    'ratingStar': review ? review.ratingStar : 5,
                                    'content': review ? review.content : "",
                                }}
                            >
                                <Form.Item name="classroomId" hidden><Input hidden={true} /></Form.Item>
                                <Form.Item name="ratingStar">
                                    <Rate className="review-modal-rating-icon" allowHalf onHoverChange={hanldeHoverChange} />
                                </Form.Item>
                                <Form.Item name="content">
                                    <TextArea style={{ width: "100%" }} rows={4} placeholder="Hãy cho chúng tôi biết trải nghiệm cá nhân của riêng bạn khi tham gia khóa học này. Khóa học có phù hợp với bạn không?" />
                                </Form.Item>
                            </Form>
                        </Modal>
                        <Button onClick={showModal}>{review ? "Cập nhật" : "Viết"} đánh giá</Button>
                        <div className="review-wrapper">
                            {reviews && reviews.length > 0 && reviews.map((review) => <Review review={review} key={`review-of-classroom-${review.id}`} isFilter={false} />)}
                        </div>
                    </div>,
                };
            })}
        />

    </div>
}
export default ClassroomDetail;