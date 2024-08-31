import { Link } from 'react-router-dom';
import { CourseListGetType, CourseType } from '../../types/CourseType'
import './Card.style.scss'
import { Rate } from 'antd';
import { formatCurrency } from '../../utils/Format';

type Props = {
    course: CourseType | CourseListGetType
}
function Card(props: Props) {
    const { course } = props;
    return (
        <Link className='card-container' to={`/courses/${course.id}`}  >
            <img className='course-image' src={course.image} alt="course image" />
            <h3 className='card-course-title'>{course.title}</h3>
            <span className='course-instructor'>{course.createdBy}</span>
            <span className='course-rating'>
                <span className='average-rating'>{course.averageRating}</span>
                <Rate className='rating' allowHalf disabled defaultValue={course.averageRating} />
                <span className='count-rating'>{course.ratingCount}</span>
            </span>
            <span className='course-price'>{course.free == true ? "Miễn phí" : formatCurrency(course.price)}</span>
        </Link>

    )
}

export default Card