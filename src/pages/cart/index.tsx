import { Button } from 'antd';
import './Cart.style.scss'
import Course from '../../components/course';
import { RootState } from '../../redux/store';
import { useAppSelector } from '../../redux/hooks';
import { CartType } from '../../types/CartType';
function Cart() {
    const { carts } = useAppSelector((state: RootState) => state.carts);

    const cartLength = carts ? carts.length : 0;
    const totalPrice = carts ? carts.reduce((total, item) => total + item.course.price, 0) : 0
    const cartBuyLaters = carts && carts.filter(item => item.buyLater) as CartType[]
    const cartBuyLaterLength = cartBuyLaters ? cartBuyLaters.length : 0;

    return <div className="cart-container">
        <div className="header">Giỏ hàng</div>
        <div className="wrapper">
            <div className="left">
                <div className="totalCourse">{cartLength} khóa học trong giỏ hàng</div>
                {carts && carts.map((cart) => {
                    if (cart.buyLater == false) {
                        return <Course cart={cart} key={`cart-${cart.id}`} />
                    }
                })}

                {cartBuyLaterLength > 0 && <div className="buyLaterCourse">Gần đây được thêm vào danh sách mong ước</div>}
                {cartBuyLaters && cartBuyLaters.map((cart) => {
                    if (cart.buyLater == true) {
                        return <Course cart={cart} key={`cart-${cart.id}`} />
                    }
                })}
            </div>
            <div className="right">
                <div className="total">
                    <div className="total-header">Tổng</div>
                    <span className="total-price">d {totalPrice}</span>
                </div>
                <Button className='payment-btn'>Thanh toán</Button>
            </div>
        </div>
    </div>;
}

export default Cart;