import { Button, Divider, Input } from 'antd';
import './Cart.style.scss'
import { LiaTimesSolid } from "react-icons/lia"
import Course from '../../components/course';
import { RootState } from '../../redux/store';
import { useAppSelector } from '../../redux/hooks';
import { CartType } from '../../types/CartType';
import { useNavigate } from 'react-router-dom';
import { getByCode } from '../../services/CouponService';
import { useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { CouponType } from '../../types/CouponType';
import { AxiosError } from 'axios';
function Cart() {
    const { carts } = useAppSelector((state: RootState) => state.carts);
    const navigate = useNavigate()
    const cartLength = carts ? carts.length : 0;
    const totalPrice = carts ? carts.reduce((total, item) => item.buyLater == false ? total + item.course.price : total, 0) : 0
    const cartBuyLaters = carts && carts.filter(item => item.buyLater) as CartType[]
    const cartBuyLaterLength = cartBuyLaters ? cartBuyLaters.length : 0;
    const [disabledDiscount, setDisabledDiscount] = useState<boolean>(false);
    const [couponValue, setCouponValue] = useState<string>("");
    const [coupon, setCoupon] = useState<CouponType>();
    const [errorMessage, setErrorMessage] = useState<string>();

    const getTotalPrice = (): number => {
        if (coupon) {
            const newTotal = totalPrice - coupon.discountPercent * totalPrice / 100
            return newTotal;
        }
        return totalPrice;
    }

    const handleCancelCoupon = () => {
        setCoupon(undefined);
        setDisabledDiscount(false)
        setCouponValue("");
    }
    const handleRedirectToPaymentPage = () => {
        if (coupon) {
            console.log("navigate to my destiny");
            const url = `/payment/checkout/?discountPercent=${coupon.discountPercent}&couponCode=${coupon.code}`;
            console.log(url);
            navigate(url)
        } else {
            navigate("/payment/checkout")
        }

    }
    const handleSearchCoupon = async () => {
        try {
            const res = await getByCode(couponValue);
            console.log(res);

            if (res.status === 200) {
                // Handle decrease total price
                console.log(res.data);
                const data = res.data as CouponType;
                setDisabledDiscount(true);
                setCoupon(data);
                setErrorMessage("");
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                setErrorMessage(message);
            }
        }
    }

    const handleChangeCouponValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const counponVal = e.target.value;
        setCouponValue(counponVal);
    }

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
                    <span className="total-price">₫ {getTotalPrice()}</span>
                    {coupon && <>
                        <span className="total-old-price">₫ {totalPrice}</span>
                        <span className="total-discount">Giam {coupon.discountPercent}%</span>
                    </>}
                </div>
                <Button className='payment-btn' onClick={handleRedirectToPaymentPage}>Thanh toán</Button>
                <Divider className='payment-divider' />
                <h3 className='coupon-header'>Khuyến mãi</h3>
                {coupon && <div className="coupon-used">
                    <div className="coupon-used-left">
                        <ul>
                            <li>
                                Đã áp dụng <b>{coupon.code}</b>
                            </li>
                            <li>Coupon của Udemy</li>
                        </ul>
                    </div>
                    <span className="coupon-used-right" onClick={handleCancelCoupon}>
                        <LiaTimesSolid />
                    </span>
                </div>}
                <div className="coupon-input">
                    <Input disabled={disabledDiscount} className='coupon-input' placeholder='Nhập khuyến mãi' value={couponValue} onChange={handleChangeCouponValue} />
                    <Button disabled={disabledDiscount} onClick={handleSearchCoupon} className='coupon-btn'>Áp dụng</Button>
                </div>
                {errorMessage && errorMessage !== "" && <span className='coupon-error'>{errorMessage}</span>}
            </div>
        </div>
    </div>;
}

export default Cart;