import { Rate } from 'antd';
import './FilterCourse.style.scss'
import { CourseListGetType } from '../../types/CourseType';

type PropType = {
    course: CourseListGetType
}
function FilterCourse(props: PropType) {
    const { course } = props;
    return <div className="filter-course-container">
        <div className="filter-right-course-left">
            <img src={course.image} alt="course-image" />
        </div>
        <div className="filter-right-course-middle">
            <h3 className="filter-right-course-title">{course.title}</h3>
            <span className="filter-right-course-desc">{course.headline}</span>
            <div className="filter-right-course-instructor">{course.createdBy}</div>
            <div className="filter-right-course-rating">
                <div className="rating-number">{course.averageRating}</div>
                <Rate className="rating" allowHalf disabled defaultValue={course.averageRating} />
                <div className="review-number">({course.ratingCount} xếp hạng)</div>
            </div>
            <div className="filter-right-course-total">
                <div className="total-hours">Tổng số {course.totalDurationCourse}</div>
                <div className="total-lectures">{course.totalLectures} bài giảng</div>
                <div className="level">{course.level}</div>
            </div>
        </div>
        <div className="filter-right-course-right">
            {course.price} d
        </div>
    </div>
}
export default FilterCourse;