import { Divider, Rate } from "antd";
import "./Course.style.scss";
import { CartType } from "../../types/CartType";
import { useAppDispatch } from "../../redux/hooks";
import { deleteCart, updateCart } from "../../redux/slices/CartSlice";
import { deleteCartById, updateCartBuyLaterById } from "../../services/CartService";
import { formatCurrency } from "../../utils/Format";
type PropType = {
    cart: CartType;
};
function Course(props: PropType) {
    const { cart } = props;
    const course = cart.course;
    const dispatch = useAppDispatch();
    const handleDeleteCart = async () => {
        const cartId = cart.id as number;
        const res = await deleteCartById(cartId);
        dispatch(deleteCart(cartId));
    };

    const handleSaveForLater = async () => {
        const cartId = cart.id as number;
        const res = await updateCartBuyLaterById(cartId);
        dispatch(updateCart(cartId));
    };
    return (
        <>
            <Divider />
            <div className="course-component-container">
                <img src={cart.course.image} alt="image course" className="image-course" />
                <div className="content-course">
                    <h2 className="course-title">{cart.course.title}</h2>
                    <div className="intructor-name">{cart.course.createdBy}</div>
                    <div className="review">
                        <div className="rating-number">{cart.course.averageRating}</div>
                        <Rate className="rating" disabled defaultValue={cart.course.averageRating} />
                        <div className="review-number">({cart.course.ratingCount} xếp hạng)</div>
                    </div>
                    <div className="desc">
                        <div className="total-hours">Tổng số {cart.course.totalDurationCourse}</div>
                        <div className="total-lectures">{cart.course.totalLectures} bài giảng</div>
                        <div className="level">{cart.course.level}</div>
                    </div>
                </div>
                <div className="course-action">
                    <div className="delete" onClick={handleDeleteCart}>
                        Xóa
                    </div>
                    <div className="save-for-later" onClick={handleSaveForLater}>
                        {cart.buyLater == false ? "Lưu lại để mua sau" : "Chuyển vào giỏ hàng"}
                    </div>
                </div>
                <div className="course-price">
                    <span>
                        {course.free == true
                            ? "Miễn phí"
                            : course.price != course.discountedPrice
                            ? formatCurrency(course.discountedPrice)
                            : formatCurrency(course.price)}
                    </span>
                    {course.free == false && course.price != course.discountedPrice && (
                        <span className="course-discountPrice">{formatCurrency(course.price)}</span>
                    )}
                </div>
            </div>
        </>
    );
}

export default Course;
