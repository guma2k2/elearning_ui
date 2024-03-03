import { Link } from 'react-router-dom';
import { CourseType } from '../../types/CourseType'
import './Cart.style.scss'
type Props = {
    course: CourseType
}
function Cart(props: Props) {
    const { course } = props;

    return (
        <Link className='cart-container' to={"/course/:id"} >
            <img className='course-image' src={course.imageURL} alt="course image" />
            <h3>{course.title}</h3>
            <span>in28Minutes Official</span>
        </Link>
    )
}

export default Cart