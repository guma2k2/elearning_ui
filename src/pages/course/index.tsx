import { Button, Rate } from 'antd';
import './Course.style.scss'
import { MdOutlineKeyboardArrowRight, MdOutlineOndemandVideo } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { get } from '../../services/CourseService';
import { CourseType } from '../../types/CourseType';
import SectionForStudent from '../../components/sectionStudent';
import { FaClock } from 'react-icons/fa';
import { FaBatteryFull, FaCheck } from 'react-icons/fa6';
import { PiSubtitles } from 'react-icons/pi';

import StarIcon from '../../assets/star.png'
import Review from '../../components/review';
function CourseDetail() {
    let { courseId } = useParams();

    console.log(courseId);


    const [course, setCourse] = useState<CourseType>();

    useEffect(() => {
        const fetchCourseById = async () => {
            const res = await get(courseId);
            const currentCourse = res.data as CourseType
            if (res.status === 200) {
                setCourse(currentCourse);
            }
        }
        fetchCourseById();

    }, [courseId])

    return <div className="course-container">
        <div className="header">
            <div className="left">
                <div className="breadcrumb">CNTT & Phần mềm <MdOutlineKeyboardArrowRight />
                    CNTT & Phần mềm khác <MdOutlineKeyboardArrowRight />
                    Spring Framework</div>
                <div className="title">{course && course.title}</div>
                <div className="headline">{course && course.headline}</div>
                <div className="review">
                    <div className="rating-number">{course?.averageRating}</div>
                    <Rate className="rating" allowHalf disabled defaultValue={4.6} />
                    <div className="review-number">({course?.ratingCount} xếp hạng)</div>
                </div>
                <div className="instructor-name">Được tạo bởi {course?.createdBy}</div>
            </div>
            <div className="right"></div>
        </div>
        <div className="content">
            <div className="left">
                <div className="lessons-content">
                    <div className="lesson-header">Nội dung bài học</div>
                    <div className="lesson-content">
                        {course && course.objectives?.map((objective, index) => <div key={`objective-${index}`} className="lesson"><FaCheck /> <span>{objective}</span></div>)}
                    </div>
                </div>
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

                    <div className="review-course-container">
                        <div className="review-header">
                            <img src={StarIcon} alt="star icon" />
                            <span>4,6 xếp hạng khóa học</span>
                            <span>25K xếp hạng</span>
                        </div>
                        <div className="review-wrapper">
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                        </div>
                        <Button className='btn-review-showmore'>Hien them danh gia</Button>
                    </div>

                </div>
            </div>
            <div className="right">
                <div className="course-media">
                    <img src={course?.image} alt="Course img" />
                </div>
                <div className="course-detail">
                    <div className="course-detail-action">
                        <span className="course-action-price">{course?.price} đ</span>
                        <Button className='btn-add-to-cart'>Thêm vào giỏ hàng</Button>
                        <Button className='btn-buy-now'>Mua ngay</Button>
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

    </div>;
}

export default CourseDetail;