import { Button, Divider, Select } from 'antd';
import './Payment.style.scss'
import { BankSelectionData } from '../../utils/BankData';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { CartType } from '../../types/CartType';
import { useEffect, useState } from 'react';
import { OrderDetailPostDto, OrderPostDto } from '../../types/OrderType';
import { save } from '../../services/OrderService';
import { PaymentRequestType, VNPayResponse } from '../../types/PaymentType';
import { pay } from '../../services/PaymentService';
import { useLocation, useParams } from 'react-router-dom';
import { CourseGetType } from '../../types/CourseType';
import { get } from '../../services/CourseService';


function PaymentCourse() {
    const { id } = useParams();
    const location = useLocation();
    const [bankCode, setBankCode] = useState<string>("NCB");
    const [course, setCourse] = useState<CourseGetType>();
    const [discountPercent, setDiscountPercent] = useState<number>();
    const [total, setTotal] = useState<number>(0);
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setBankCode(value)
    };

    const handlePayment = async () => {
        if (course) {
            const orderDetailList: OrderDetailPostDto[] = [
                {
                    courseId: course.id,
                    price: course.price,
                }
            ]

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

    const fetchCourseById = async (id: number) => {
        const res = await get(id);
        if (res.status == 200) {
            const data = res.data as CourseGetType
            setCourse(data);
            const searchParams = new URLSearchParams(location.search);
            const discountPercentParam = searchParams.get('discountPercent');
            console.log(discountPercentParam);
            if (discountPercentParam != null) {
                console.log(discountPercentParam);
                let discountPercentNumber = parseInt(discountPercentParam);
                console.log(discountPercentNumber);
                setDiscountPercent(discountPercentNumber)
                const newTotal = data?.price - discountPercentNumber * data?.price / 100
                setTotal(newTotal);
            } else {
                setTotal(data.price)
            }
        }
    }
    useEffect(() => {
        if (id) {
            const courseId = parseInt(id);
            fetchCourseById(courseId);
        }
    }, [id]);

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
                        <div className="payment-left-order-item">
                            <div className="payment-left-order-left">
                                <img src={course?.image} alt="course image" />
                                <span className='payment-left-order-course-name'>{course?.title}</span>
                            </div>
                            <span className="payment-left-order-right">{course?.price} d</span>
                        </div>
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
                        <span className="payment-old-price-right">₫ {course?.price}</span>
                    </div>
                    <div className="payment-discount-price">
                        <div className="payment-old-price-left">Mức chiết khấu:</div>
                        <span className="payment-old-price-right">₫ {course && course.price ? course?.price * discountPercent / 100 : 0}</span>
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

export default PaymentCourse;