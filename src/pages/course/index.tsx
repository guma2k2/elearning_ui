import { Rate } from 'antd';
import './Course.style.scss'
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
function Course() {
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
                <div className="course-content"></div>
            </div>
            <div className="right"></div>
        </div>

    </div>;
}

export default Course;