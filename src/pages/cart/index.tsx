import { Button } from 'antd';
import './Cart.style.scss'
import Course from '../../components/course';
function Cart() {
    return <div className="cart-container">
        <div className="header">Giỏ hàng</div>
        <div className="wrapper">
            <div className="left">
                <div className="totalCourse">8 khóa học trong giỏ hàng</div>
                <Course />
                <Course />
                <Course />
            </div>
            <div className="right">
                <div className="total">
                    <div className="total-header">Tổng</div>
                    <span className="total-price">d 290.000</span>
                </div>
                <Button className='payment-btn'>Thanh toán</Button>
            </div>
        </div>
    </div>;
}

export default Cart;