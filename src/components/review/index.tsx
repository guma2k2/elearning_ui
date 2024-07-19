import { Divider, Rate } from "antd";
import './Review.style.scss'
function Review() {
    return <div className="review-container">
        <Divider />
        <div className="review-top">
            <img src="https://img-b.udemycdn.com/user/50x50/184376710_079e.jpg" alt="user-photo" className="review-top-left" />
            <div className="review-top-right">
                <div className="review-name">Rushikesh J.</div>
                <div className="review-rating">
                    <Rate className='rating' allowHalf disabled defaultValue={4.5} />
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