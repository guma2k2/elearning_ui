import { Button, Flex, Form, Input, Modal, Progress, Rate } from "antd";
import './MyLearningCourse.style.scss'
import { Fragment, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { LearningCourse } from "../../types/learning/LearningCourseType";
import { ReviewGet, ReviewLearningCourse, ReviewPost, ReviewStatusPostType } from "../../types/ReviewType";
import { createReview, updateReview, updateStatusReview } from "../../services/ReviewService";
import { useAppDispatch } from "../../redux/hooks";
import { createReviewForLearningCourse, updateReviewOfLearningCourse } from "../../redux/slices/LearningCourseSlice";
import { useNavigate } from "react-router-dom";

type PropType = {
    learingCourse: LearningCourse
}
function MyLearningCourse(props: PropType) {
    const navigate = useNavigate();
    const { learingCourse } = props;
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ratingText, setRatingText] = useState<string>("Tuyệt vời, trên cả mong đợi!");
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const handleOk = () => {
        form.submit()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const onFinish = async (values: ReviewPost) => {
        console.log('Received values of form: ', values);
        const type: string = learingCourse.review ? "update" : "create";
        console.log(type);

        if (type == "create") {
            const res = await createReview(values);
            if (res.status == 200) {
                const review = res.data as ReviewGet
                const reviewLearningCourse: ReviewLearningCourse = {
                    review, id: learingCourse.id
                }

                dispatch(createReviewForLearningCourse(reviewLearningCourse))
            }
        } else {
            if (learingCourse.review) {
                const reviewId = learingCourse.review.id;
                const res = await updateReview(values, reviewId);
                if (res.status == 200) {
                    const review = res.data as ReviewGet
                    const reviewLearningCourse: ReviewLearningCourse = {
                        review, id: learingCourse.id,
                    }
                    dispatch(updateReviewOfLearningCourse(reviewLearningCourse))
                }
            }
        }
    };
    const handleRedirectToLearningCourse = () => {
        if (learingCourse) {
            const course = learingCourse.course;
            if (course) {
                let url = `/course/${course.slug}/learning`
                navigate(url);
            }
        }
    }


    const handleNavigateToClassroom = () => {
        navigate(`/classrooms/course/${learingCourse.course.id}`)
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
    const handleUpdateStatusReview = async (reviewId: number, status: string) => {
        if (learingCourse) {
            const body: ReviewStatusPostType = {
                status: status,
                reason: ""
            }
            const resUpdate = await updateStatusReview(body, reviewId);
            if (resUpdate.status === 204) {
                const currentReview = learingCourse.review;
                const review: ReviewGet = {
                    ...currentReview, status: status
                }
                const reviewLearningCourse: ReviewLearningCourse = {
                    review, id: learingCourse.id,
                }
                dispatch(updateReviewOfLearningCourse(reviewLearningCourse))
                alert("success");
            }
        }
    }
    return <Fragment>
        <div className="my-learning-course-container" onClick={handleRedirectToLearningCourse}>
            <img src={learingCourse.course.image} alt="course-image" className="my-learning-course-image" />
            <h3 className="my-learning-course-title">{learingCourse.course.title}</h3>
            <div className="my-learning-course-instructor">{learingCourse.course.createdBy}</div>
            <Progress percent={learingCourse.percentFinished} showInfo={false} className="my-learning-course-progress" />
            <div className="my-learning-course-bottom">
                <div className="my-learning-course-progress-text">Hoàn thành {learingCourse.percentFinished}%</div>
                <div className="my-learning-course-rating" onClick={(e) => { e.stopPropagation(); showModal(); }}>
                    <Rate allowHalf disabled value={learingCourse.review ? learingCourse.review.ratingStar : 0} className="my-learning-course-rating-icon" />
                    <div className="my-learning-course-rating-text">Xếp hạng của bạn</div>

                </div>
            </div>
            <Button onClick={(e) => { e.stopPropagation(); handleNavigateToClassroom() }}>Danh sách lớp học</Button>
        </div>;
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="Hủy" rootClassName="review-modal" okText={"Lưu và tiếp tục"}>
            <Flex gap={10}>
                {learingCourse.review && learingCourse.review.status != "PUBLISHED" && <Button onClick={() => handleUpdateStatusReview(learingCourse.review.id, "UNDER_REVIEW")} style={{ marginLeft: "10px" }} disabled={learingCourse.review.status == "UNDER_REVIEW"}>{learingCourse.review.status == "UNPUBLISHED" ? "CÔNG KHAI" : "CHỜ ĐÁNH GIÁ"}</Button>}
                {learingCourse.review && learingCourse.review.status == "UNPUBLISHED" && learingCourse.review.reason != "" && <Button onClick={() => { alert(learingCourse.review.reason) }}>Xem lý do từ chối duyệt</Button>}
            </Flex>
            <h1>Vì sao bạn xếp hạng ở mức này?</h1>
            <span className="review-modal-rating-text">{ratingText}</span>
            <Form
                form={form}
                name="validate_other"
                onFinish={onFinish}
                style={{ width: "100%" }}
                initialValues={{
                    'courseId': learingCourse.course.id,
                    'ratingStar': learingCourse.review ? learingCourse.review.ratingStar : 5,
                    'content': learingCourse.review ? learingCourse.review.content : "",
                }}
            >
                <Form.Item name="courseId" hidden><Input hidden={true} /></Form.Item>
                <Form.Item name="ratingStar">
                    <Rate className="review-modal-rating-icon" allowHalf onHoverChange={hanldeHoverChange} />
                </Form.Item>
                <Form.Item name="content">
                    <TextArea style={{ width: "100%" }} rows={4} placeholder="Hãy cho chúng tôi biết trải nghiệm cá nhân của riêng bạn khi tham gia khóa học này. Khóa học có phù hợp với bạn không?" />
                </Form.Item>
            </Form>
        </Modal>
    </Fragment>
}

export default MyLearningCourse;