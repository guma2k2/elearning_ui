import { Link } from 'react-router-dom';
import { CourseType } from '../../types/CourseType'
import './Cart.style.scss'
import { Rate } from 'antd';
import { useRef } from 'react';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
type Props = {
    course: CourseType
}
function Cart(props: Props) {
    const { course } = props;
    return (
        <Link className='cart-container' to={"/course/:id"} >
            <img data-tooltip-id="my-tooltip" className='course-image' src={course.imageURL} alt="course image" />
            <h3>{course.title}</h3>
            <span className='course-instructor'>in28Minutes Official</span>
            <span className='course-rating'>
                <span className='average-rating'>4.8</span>
                <Rate className='rating' allowHalf disabled defaultValue={4.5} />
                <span className='count-rating'>22</span>
            </span>
            <span className='course-price'>299 000 d</span>
            <Tooltip
                place='bottom-end'
                id="my-tooltip"
                render={({ }) => (
                    <div className='tooltip-container'>
                        <h2>Lập trình Python từ cơ bản đến nâng cao thông qua các dự án</h2>
                    </div>
                )}
            />
        </Link>

    )
}

export default Cart