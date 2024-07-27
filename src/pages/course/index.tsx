import { Button, Modal, Progress, Rate } from 'antd';
import './Course.style.scss'
import { MdOutlineKeyboardArrowRight, MdOutlineOndemandVideo } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { get } from '../../services/CourseService';
import { CourseType } from '../../types/CourseType';
import SectionForStudent from '../../components/sectionStudent';
import { FaClock } from 'react-icons/fa';
import { FaBatteryFull, FaCheck } from 'react-icons/fa6';
import { PiSubtitles } from 'react-icons/pi';
import { IoMdStar } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import StarIcon from '../../assets/star.png'
import Review from '../../components/review';
import { getReviewsByCourseId } from '../../services/ReviewService';
import { PageReviewResponse, ReviewGet, ReviewPercent } from '../../types/ReviewType';
import { FaCirclePlay } from "react-icons/fa6";
import { LiaCertificateSolid } from "react-icons/lia";
import { LiaTimesSolid } from "react-icons/lia"
function CourseDetail() {
    let { courseId } = useParams();

    const navigate = useNavigate();
    const [reviews, setReviews] = useState<ReviewGet[]>([]);
    const [reviewsCourse, setReviewsCourse] = useState<ReviewGet[]>([]);

    const [reviewPercent, setReviewPercent] = useState<ReviewPercent>();
    const [pageNumReview, setPageNumReview] = useState<number>(0)

    const [ratingSelected, setRatingSelected] = useState<number>(0);

    const [course, setCourse] = useState<CourseType>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getBreadcrumb = (): string[] => {
        if (course) {
            return course.breadcrumb.split("-");
        }
        return [];
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleLearning = () => {
        if (course) {
            navigate(`/course/${course.slug}/learning`)
        }
        console.log("cc");
    }
    useEffect(() => {
        console.log(ratingSelected);

        const fetchCourseById = async () => {
            const res = await get(courseId);
            const currentCourse = res.data as CourseType
            if (res.status === 200) {
                setCourse(currentCourse);
            }
        }


        const fetchReviewByCourseId = async () => {
            const res = await getReviewsByCourseId(courseId, undefined, undefined);
            if (res.status === 200) {
                const pageReviewResponse = res.data as PageReviewResponse
                const reviews = pageReviewResponse.content;
                const percentFiveStar = pageReviewResponse.percentFiveStar;
                const percentFourStar = pageReviewResponse.percentFourStar;
                const percentThreeStar = pageReviewResponse.percentThreeStar;
                const percentTwoStar = pageReviewResponse.percentTwoStar;
                const percentOneStar = pageReviewResponse.percentOneStar;
                setReviews(reviews);
                setReviewsCourse(reviews)
                const newReviewPercent: ReviewPercent = {
                    percentFiveStar,
                    percentFourStar,
                    percentThreeStar,
                    percentTwoStar,
                    percentOneStar
                }
                setReviewPercent(newReviewPercent)
            }
        }
        fetchCourseById();
        fetchReviewByCourseId();

    }, [courseId])

    const loadMoreData = async (ratingStar: number | undefined, type: "more" | "rate" | "reset") => {
        let newPageNum: number = pageNumReview;
        if (type == "rate") {
            if (ratingStar) {
                setRatingSelected(ratingStar);
                setPageNumReview(0)
                newPageNum = 0;
            }
        } else if (type == "more") {
            setPageNumReview((prev) => prev + 1)
            newPageNum = pageNumReview + 1;

        } else if (type == "reset") {
            setPageNumReview(0)
            newPageNum = 0;
        }
        console.log(ratingStar);
        const res = await getReviewsByCourseId(courseId, newPageNum, ratingStar);
        console.log(res);
        const pageReviewResponse = res.data as PageReviewResponse
        const reviews = pageReviewResponse.content;
        const pageNum = pageReviewResponse.pageNum;
        const percentFiveStar = pageReviewResponse.percentFiveStar;
        const percentFourStar = pageReviewResponse.percentFourStar;
        const percentThreeStar = pageReviewResponse.percentThreeStar;
        const percentTwoStar = pageReviewResponse.percentTwoStar;
        const percentOneStar = pageReviewResponse.percentOneStar;
        if (res.status === 200) {
            if (pageNum !== 0) {
                setReviews((prev) => [...prev, ...reviews]);
            } else if (pageNum === 0) {
                setReviews(reviews);
            }
            const newReviewPercent: ReviewPercent = {
                percentFiveStar,
                percentFourStar,
                percentThreeStar,
                percentTwoStar,
                percentOneStar
            }
            setReviewPercent(newReviewPercent)
        }


    }

    return <div className="course-container">
        <div className="header">
            <div className="left">
                <div className="breadcrumb">{getBreadcrumb()[0]}<MdOutlineKeyboardArrowRight />
                    {getBreadcrumb()[1]} <MdOutlineKeyboardArrowRight />
                    {getBreadcrumb()[2]}</div>
                <div className="title">{course && course.title}</div>
                <div className="headline">{course && course.headline}</div>
                <div className="review">
                    <div className="rating-number">{course?.averageRating}</div>
                    <Rate className="rating" allowHalf disabled value={course?.averageRating} />
                    <div className="review-number">({course?.ratingCount} xếp hạng)</div>
                </div>
                <div className="instructor-name">Được tạo bởi {course?.createdBy}</div>
            </div>
            <div className="right"></div>
        </div>
        <div className="content">
            <div className="left">
                {course && course.objectives && course.objectives.length > 0 && <div className="lessons-content">
                    <div className="lesson-header">Nội dung bài học</div>
                    <div className="lesson-content">
                        {course && course.objectives?.map((objective, index) => <div key={`objective-${index}`} className="lesson"><FaCheck /> <span>{objective}</span></div>)}
                    </div>
                </div>}
                <div className="course-content">
                    <div className="course-content-header-wrapper">
                        <h2 className="course-content-header-block">Nội dung khóa học</h2>
                        <div className="sub-head-wrapper">
                            <div className="sub-head-left">
                                <div className="total-section">{course?.sections.length} chương</div>
                                <div className="total-lesson">{course?.totalLectureCourse} bài học</div>
                                <div className="total-time">Thời lượng {course?.totalDurationCourse}</div>
                            </div>
                            <div className="sub-head-right">Mở rộng tất cả</div>
                        </div>
                    </div>

                    <div className="lessons-container">
                        {course && course.sections.map((sec, index) => {
                            return <SectionForStudent key={`section-student-${index}`} section={sec} index={index + 1}></SectionForStudent>
                        })}
                    </div>
                    {course && course.requirements && course.requirements.length > 0 && <div className='requirement-container'>
                        <h2 className="requirement-header">
                            Yeu cau
                        </h2>
                        <ul className="requirement-item">
                            {course.requirements.map((item, index) => <li key={`requirement-course-detail-${index}`}><span>{item}</span></li>)}
                        </ul>
                    </div>}
                    <div className="intructor-course-container">
                        <h2 className="instructor-header">
                            Giảng viên
                        </h2>
                        <span>{course?.user?.fullName}</span>

                        <div className="instructor-course-wrapper">
                            <img src="https://img-b.udemycdn.com/user/200_H/7799204_2091_5.jpg" alt="instructor-image" />
                            <img src={course?.user?.photo} alt="instructor-image" />

                            <div className="instructor-course-right">
                                <div className="intructor-course-right-item">
                                    <IoMdStar />
                                    <span>4,7 xếp hạng giảng viên</span>
                                    {/* <span>{course?.user?.averageRating}xếp hạng giảng viên</span> */}
                                </div>
                                <div className="intructor-course-right-item">
                                    <IoPeopleSharp />
                                    <span>4404 học viên</span>
                                    {/* <span>{course?.user?.numberOfStudent} học viên</span> */}
                                </div>
                                <div className="intructor-course-right-item">
                                    <LiaCertificateSolid />
                                    <span>4404 học viên</span>
                                    {/* <span>{course?.user?.numberOfReview} danh gia</span> */}
                                </div>
                                <div className="intructor-course-right-item">
                                    <FaCirclePlay />
                                    <span>8 khóa học</span>
                                    <span>{course?.user?.numberOfCourse} khóa học</span>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="review-course-container">
                        <div className="review-header">
                            <div className="review-total-rating">
                                <img src={StarIcon} alt="star icon" />
                                <span>4,6 xếp hạng khóa học</span>
                            </div>
                            <span>25K xếp hạng</span>
                        </div>
                        <div className="review-wrapper">
                            {reviewsCourse && reviewsCourse.length > 0 && reviewsCourse.map((review) => <Review review={review} key={`review-of-course-${review.id}`} isFilter={false} />)}
                        </div>
                        <Button onClick={showModal} className='btn-review-showmore'>Hiện thêm đánh giá</Button>

                    </div>

                    {course && course.description &&
                        <div className='desc-container'>
                            <h2 className="desc-header">
                                Mo ta
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: course.description }}></div>
                        </div>}
                </div>
            </div>
            <div className="right">
                <div className="course-media">
                    <img src={course?.image} alt="Course img" />
                </div>
                <div className="course-detail">
                    <div className="course-detail-action">
                        <span className="course-action-price">{course?.free == true ? `${course.price} d` : "Mien phi"}</span>
                        {course?.learning == false && <Button className='btn-add-to-cart'>Thêm vào giỏ hàng</Button>}
                        <Button className='btn-buy-now' onClick={handleLearning}>{course?.learning == true ? "Chuyen den khoa hoc" : course?.free == true ? "Dang ki khoa hoc" : "Mua khoa hoc"}</Button>
                    </div>
                    <div className="course-info">
                        <div className="course-info-level">
                            <PiSubtitles />
                            <span>{course?.level}</span>
                        </div>
                        <div className="course-info-total-lesson">
                            <MdOutlineOndemandVideo />
                            <span>Tổng số {course?.totalLectureCourse} bài học</span>
                        </div>
                        <div className="course-info-total-time">
                            <FaClock />
                            <span>Thời lượng {course?.totalDurationCourse}</span>
                        </div>
                        <div className="course-info-benefit">
                            <FaBatteryFull />
                            <span>Học mọi lúc mọi nơi</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <Modal width={900} rootClassName='review-course-modal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
            <div className="review-course-modal-container">
                <div className="review-header">
                    <div className="review-total-rating">
                        <img src={StarIcon} alt="star icon" />
                        <span>4,6 xếp hạng khóa học</span>
                    </div>
                    <span>25K xếp hạng</span>
                </div>
                <div className="review-filter-container">
                    <div className="review-filter-left">
                        <div className={`review-filter-left-item ${(ratingSelected != 5 && ratingSelected != 0) ? "active" : ""}`}>
                            <div className="review-filter-left-rating" onClick={() => loadMoreData(5, "rate")}>
                                <Progress className='review-filter-left-progress' percent={reviewPercent?.percentFiveStar} size="small" showInfo={false} />
                                <Rate className='review-filter-left-rate' allowHalf disabled defaultValue={5} />
                                <span>{reviewPercent?.percentFiveStar}%</span>
                            </div>
                            {ratingSelected === 5 && <LiaTimesSolid onClick={() => {
                                setRatingSelected(0);
                                loadMoreData(undefined, "reset")
                            }} className='review-cancel-filter' />}
                        </div>
                        <div className={`review-filter-left-item ${(ratingSelected != 4 && ratingSelected != 0) ? "active" : ""}`}>
                            <div className="review-filter-left-rating" onClick={() => loadMoreData(4, "rate")}>
                                <Progress className='review-filter-left-progress' percent={reviewPercent?.percentFourStar} size="small" showInfo={false} />
                                <Rate className='review-filter-left-rate' allowHalf disabled defaultValue={5} />
                                <span>{reviewPercent?.percentFourStar}%</span>
                            </div>
                            {ratingSelected === 4 && <LiaTimesSolid onClick={() => {
                                setRatingSelected(0);
                                loadMoreData(undefined, "reset")
                            }} className='review-cancel-filter' />}
                        </div>
                        <div className={`review-filter-left-item ${(ratingSelected != 3 && ratingSelected != 0) ? "active" : ""}`}>
                            <div className="review-filter-left-rating" onClick={() => loadMoreData(3, "rate")}>
                                <Progress className='review-filter-left-progress' percent={reviewPercent?.percentThreeStar} size="small" showInfo={false} />
                                <Rate className='review-filter-left-rate' allowHalf disabled defaultValue={5} />
                                <span>{reviewPercent?.percentThreeStar} %</span>
                            </div>
                            {ratingSelected === 3 && <LiaTimesSolid onClick={() => {
                                setRatingSelected(0);
                                loadMoreData(undefined, "reset")
                            }} className='review-cancel-filter' />}
                        </div>
                        <div className={`review-filter-left-item ${(ratingSelected != 2 && ratingSelected != 0) ? "active" : ""}`}>
                            <div className="review-filter-left-rating" onClick={() => loadMoreData(2, "rate")}>
                                <Progress className='review-filter-left-progress' percent={reviewPercent?.percentTwoStar} size="small" showInfo={false} />
                                <Rate className='review-filter-left-rate' allowHalf disabled defaultValue={5} />
                                <span>{reviewPercent?.percentTwoStar}%</span>
                            </div>
                            {ratingSelected === 2 && <LiaTimesSolid onClick={() => {
                                setRatingSelected(0);
                                loadMoreData(undefined, "reset")
                            }} className='review-cancel-filter' />}
                        </div>
                        <div className={`review-filter-left-item ${(ratingSelected != 1 && ratingSelected != 0) ? "active" : ""}`}>
                            <div className="review-filter-left-rating" onClick={() => loadMoreData(1, "rate")}>
                                <Progress className='review-filter-left-progress' percent={reviewPercent?.percentOneStar} size="small" showInfo={false} />
                                <Rate className='review-filter-left-rate' allowHalf disabled defaultValue={5} />
                                <span>{reviewPercent?.percentOneStar}%</span>
                            </div>
                            {ratingSelected === 1 && <LiaTimesSolid onClick={() => {
                                setRatingSelected(0);
                                loadMoreData(undefined, "reset")
                            }} className='review-cancel-filter' />}
                        </div>

                    </div>
                    <div className="review-filter-right">
                        {reviews && reviews.length > 0 && reviews.map((review) => <Review review={review} key={`review-of-course-all-${review.id}`} isFilter={true} />)}
                        <Button onClick={() => loadMoreData(ratingSelected, "more")} className='btn-review-modal-showmore'>Hiện thêm đánh giá</Button>
                    </div>

                </div>
            </div>
        </Modal>
    </div>;
}

export default CourseDetail;