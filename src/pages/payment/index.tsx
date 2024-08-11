import { Button, Divider, Select } from 'antd';
import './Payment.style.scss'
import { BankSelectionData } from '../../utils/BankData';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { CartType } from '../../types/CartType';
import { useEffect, useState } from 'react';
import { OrderDetailPostDto, OrderPostDto } from '../../types/OrderType';
import { save } from '../../services/OrderService';
import { PaymentRequestType, VNPayResponse } from '../../types/PaymentType';
import { pay } from '../../services/PaymentService';
import { useLocation } from 'react-router-dom';
import { deleteCartBuyLater } from '../../redux/slices/CartSlice';


function Payment() {
    const { carts } = useAppSelector((state: RootState) => state.carts);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const cartBuyLaters = carts && carts.filter(item => !item.buyLater) as CartType[]
    const [bankCode, setBankCode] = useState<string>("NCB");
    const [discountPercent, setDiscountPercent] = useState<number>();
    const totalPrice = carts ? carts.reduce((total, item) => item.buyLater == false ? total + item.course.price : total, 0) : 0
    const [total, setTotal] = useState<number>(totalPrice);
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setBankCode(value)
    };

    const handlePayment = async () => {
        if (cartBuyLaters) {

            const orderDetailList: OrderDetailPostDto[] = cartBuyLaters
                .filter(cart => cart.buyLater === false) // Filter carts where buyLater is false
                .map(cart => ({
                    courseId: cart.course.id,
                    price: cart.course.price
                }));
            dispatch(deleteCartBuyLater());
            const searchParams = new URLSearchParams(location.search);
            let couponCode = searchParams.get('couponCode');

            let orderPostDto: OrderPostDto = couponCode != undefined ? {
                orderDetails: orderDetailList,
                couponCode: couponCode
            } : {
                orderDetails: orderDetailList
            }
            var orderId: number = -1;
            const res = await save(orderPostDto);
            console.log(res);
            if (res.status == 200) {
                orderId = res.data as number;

                const request: PaymentRequestType = {
                    amount: total,
                    bankCode,
                    orderId
                }

                const resOfPayment = await pay(request);
                if (resOfPayment.status == 200) {
                    console.log(resOfPayment);
                    const dataOfPay = resOfPayment.data as VNPayResponse;
                    const paymentUrl = dataOfPay.paymentUrl;
                    window.location.href = paymentUrl;
                }

            }
        }
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const discountPercentParam = searchParams.get('discountPercent');
        console.log(discountPercentParam);
        if (discountPercentParam) {
            console.log(discountPercentParam);
            let discountPercentNumber = parseInt(discountPercentParam);
            console.log(discountPercentNumber);
            setDiscountPercent(discountPercentNumber)
            const newTotal = totalPrice - discountPercentNumber * totalPrice / 100
            setTotal(newTotal);
        }
    }, [location]);
    return <div className="payment-container">
        <div className="payment-left">
            <div className="payment-left-wrapper">
                <h1 className="payment-left-header">Thanh Toán</h1>
                <div className="payment-left-bank">
                    <span>Ngân hàng</span>
                    <Select
                        className='payment-left-select'
                        defaultValue={bankCode}
                        onChange={handleChange}
                        options={BankSelectionData}
                    />
                </div>
                <div className="payment-left-order-content">
                    <h2 className="payment-left-order-header">Thông tin đặt hàng</h2>
                    <div className="payment-left-order-wrapper">
                        {cartBuyLaters && cartBuyLaters.map((cart) => {
                            return <div className="payment-left-order-item" key={cart.id}>
                                <div className="payment-left-order-left">
                                    <img src={cart.course.image} alt="course image" />
                                    <span className='payment-left-order-course-name'>{cart.course.title}</span>
                                </div>
                                <span className="payment-left-order-right">{cart.course.price} d</span>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
        <div className="payment-right">
            <div className="payment-right-wrapper">
                <h2 className="payment-right-header">Tóm tắt</h2>

                {discountPercent && <div className='payment-discount'>
                    <div className="payment-old-price">
                        <div className="payment-old-price-left">Giá gốc:</div>
                        <span className="payment-old-price-right">₫ {totalPrice}</span>
                    </div>
                    <div className="payment-discount-price">
                        <div className="payment-old-price-left">Mức chiết khấu:</div>
                        <span className="payment-old-price-right">₫ {totalPrice * discountPercent / 100}</span>
                    </div>
                    <Divider />
                </div>}
                <div className="payment-right-total">
                    <div className="payment-right-left">Tổng</div>
                    <span className="payment-right-right">₫ {total}</span>
                </div>
                <Button className="payment-right-btn" onClick={handlePayment}>Hoàn tất thanh toán</Button>
            </div>
        </div>
    </div>
}

export default Payment;