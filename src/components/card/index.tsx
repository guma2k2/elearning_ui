import { Link } from 'react-router-dom';
import { CourseListGetType, CourseType } from '../../types/CourseType'
import './Card.style.scss'
import { Rate } from 'antd';

type Props = {
    course: CourseType | CourseListGetType
}
function Card(props: Props) {
    const { course } = props;
    return (
        <Link className='card-container' to={`/courses/${course.id}`}  >
            <img className='course-image' src={course.image} alt="course image" />
            <h3>{course.title}</h3>
            <span className='course-instructor'>in28Minutes Official</span>
            <span className='course-rating'>
                <span className='average-rating'>4.8</span>
                <Rate className='rating' allowHalf disabled defaultValue={4.5} />
                <span className='count-rating'>22</span>
            </span>
            <span className='course-price'>299 000 d</span>
        </Link>

    )
}

export default Card