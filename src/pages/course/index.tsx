import { Button, Rate } from 'antd';
import './Course.style.scss'
import { MdOutlineKeyboardArrowRight, MdOutlineOndemandVideo } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { get } from '../../services/CourseService';
import { CourseType } from '../../types/CourseType';
import SectionForStudent from '../../components/sectionStudent';
import { FaClock } from 'react-icons/fa';
import { FaBatteryFull } from 'react-icons/fa6';
import { PiSubtitles } from 'react-icons/pi';
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
                <div className="title">[NEW] Master Spring 6, Spring Boot 3, REST, JPA, Hibernate</div>
                <div className="headline">Master Java framework Spring 6, AOP, Spring MVC, Spring Boot 3, Thymeleaf, Spring Security 6, Spring JDBC, JPA,REST</div>
                <div className="review">
                    <div className="rating-number">4.6</div>
                    <Rate className="rating" allowHalf disabled defaultValue={4.6} />
                    <div className="review-number">(3.502 xếp hạng)</div>
                </div>
                <div className="instructor-name">Được tạo bởi me</div>
            </div>
            <div className="right"></div>
        </div>
        <div className="content">
            <div className="left">
                <div className="lessons-content">
                    <div className="lesson-header">Nội dung bài học</div>
                    <div className="lesson-content">
                        <div className="lesson">What is Spring & different projects inside Spring ecosystem</div>
                        <div className="lesson">What is Spring & different projects inside Spring ecosystem</div>
                        <div className="lesson">What is Spring & different projects inside Spring ecosystem</div>
                        <div className="lesson">What is Spring & different projects inside Spring ecosystem</div>
                        <div className="lesson">What is Spring & different projects inside Spring ecosystem</div>
                    </div>
                </div>
                <div className="course-content">
                    <div className="course-content-header-wrapper">
                        <h2 className="course-content-header-block">Nội dung khóa học</h2>
                        <div className="sub-head-wrapper">
                            <div className="sub-head-left">
                                <div className="total-section">3 chương</div>
                                <div className="total-lesson">13 bài học</div>
                                <div className="total-time">Thời lượng 01 gio 34 phut</div>
                            </div>
                            <div className="sub-head-right">Mở rộng tất cả</div>
                        </div>
                    </div>

                    <div className="lessons-container">
                        {course && course.sections.map((sec, index) => {
                            return <SectionForStudent section={sec} index={index + 1}></SectionForStudent>
                        })}
                    </div>

                </div>
            </div>
            <div className="right">
                <div className="course-media">
                    <img src={course?.imageURL} alt="Course img" />
                </div>
                <div className="course-detail">
                    <div className="course-detail-action">
                        <span className="course-action-price">249.000 đ</span>
                        <Button className='btn-add-to-cart'>Thêm vào giỏ hàng</Button>
                        <Button className='btn-buy-now'>Mua ngay</Button>
                    </div>
                    <div className="course-info">
                        <div className="course-info-level">
                            <PiSubtitles />
                            <span>Trinh do co ban</span>
                        </div>
                        <div className="course-info-total-lesson">
                            <MdOutlineOndemandVideo />
                            <span>Tong so 13 bai hoc</span>
                        </div>
                        <div className="course-info-total-time">
                            <FaClock />
                            <span>Thoi luong 01 gio 34 phut</span>
                        </div>
                        <div className="course-info-benefit">
                            <FaBatteryFull />
                            <span>Hoc moi luc moi noi</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>;
}

export default CourseDetail;