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
            <img src="https://img-b.udemycdn.com/user/50x50/184376710_079e.jpg" alt="user-photo" className="review-top-left" />
            <div className="review-top-right">
                <div className="review-name">Rushikesh J.</div>
                <div className="review-rating">
                    <Rate className='review-rating-icon' allowHalf disabled defaultValue={4.5} />
                    <span>6 ngày trước</span>
                </div>
            </div>
        </div>
        <div className="review-bottom">
            Just Amazing just you need to update it with latest tech like host on the cloud platforms like aws, gcp.
        </div>
    </div>;
}

export default Review;