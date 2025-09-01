import { Link } from "react-router-dom";
import { CourseListGetType, CourseType } from "../../types/CourseType";
import "./Card.style.scss";
import { Rate } from "antd";
import { formatCurrency } from "../../utils/Format";

type Props = {
    course: CourseType | CourseListGetType;
};
function Card(props: Props) {
    const { course } = props;

    const getPrice = () => {
        if (course.price == course.discountedPrice) {
            return formatCurrency(course.price);
        }
        return;
    };
    return (
        <Link className="card-container" to={`/courses/${course.id}`}>
            <div className="course-image-wrap">
                <img className="course-image" src={course.image} alt="course image" />
            </div>
            <h3 className="card-course-title">{course.title}</h3>
            <span className="course-instructor">{course.createdBy}</span>
            <span className="course-rating">
                <span className="average-rating">{course.averageRating}</span>
                <Rate className="rating" allowHalf disabled defaultValue={course.averageRating} />
                {course.ratingCount > 0 ? <span className="count-rating">{course.ratingCount}</span> : ""}
            </span>
            <span className="course-price">
                <span>
                    {course.free == true
                        ? "Free"
                        : course.price != course.discountedPrice
                        ? formatCurrency(course.discountedPrice)
                        : formatCurrency(course.price)}
                </span>
                {course.free == false && course.price != course.discountedPrice && (
                    <span className="course-discountPrice">{formatCurrency(course.price)}</span>
                )}
            </span>
        </Link>
    );
}

export default Card;
