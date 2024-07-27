import { Divider, Rate } from "antd";
import './Review.style.scss'
import { ReviewGet } from "../../types/ReviewType";
type PropType = {
    review: ReviewGet | undefined,
    isFilter: boolean
}
function Review(prop: PropType) {
    const { review, isFilter } = prop;
    return <div className="review-container" style={{ width: `${isFilter == true ? "100%" : "calc(50% - 15px)"}` }}>
        <Divider className="review-divider" />
        <div className="review-top">
            <img src={review?.student.photo} alt="user-photo" className="review-top-left" />
            <div className="review-top-right">
                <div className="review-name">{review?.student.email}</div>
                <div className="review-rating">
                    <Rate className='review-rating-icon' allowHalf disabled defaultValue={review?.ratingStar} />
                    <span>6 ngày trước</span>
                </div>
            </div>
        </div>
        <div className="review-bottom">
            {review?.content}
        </div>
    </div>;
}

export default Review;