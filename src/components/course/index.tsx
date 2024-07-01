import { Divider, Rate } from "antd";
import { CourseListGetType } from "../../types/CourseType"

import './Course.style.scss'
type PropType = {
    course: CourseListGetType
}
function Course() {
    // const { course } = probs;
    return (
        <>
            <Divider />
            <div className="course-component-container">
                <img src="https://img-c.udemycdn.com/course/480x270/4364200_0221_5.jpg" alt="image course" className="image-course" />
                <div className="content-course">
                    <h2 className="course-title">[NEW] Master Spring 6, Spring Boot 3, REST, JPA, Hibernate</h2>
                    <div className="intructor-name">Eazy Bytes</div>
                    <div className="review">
                        <div className="rating-number"></div>
                        <Rate className="rating" disabled defaultValue={2} />
                        <div className="review-number">(3.502 xếp hạng)</div>
                    </div>
                    <div className="desc">
                        <div className="total-hours">Tổng số 36.5 giờ</div>
                        <div className="total-lectures">250 bài giảng</div>
                        <div className="level">Sơ cấp</div>
                    </div>
                </div>
                <div className="course-action">
                    <div className="delete">Xóa</div>
                    <div className="save-for-later">Lưu lại để xem sau</div>
                </div>
                <div className="course-price">299.000 d</div>
            </div>
        </>
    )
}

export default Course