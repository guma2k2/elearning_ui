import { Button, Result } from "antd";
import { useEffect, useState } from "react";
import { PaymentPost } from "../../types/PaymentType";
import { savePayment } from "../../services/PaymentService";
import { OrderStatus, updateOrderStatus } from "../../services/OrderService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { getLearningCourse } from "../../redux/slices/LearningCourseSlice";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";

function VnPayCallback() {
    const dispatch = useAppDispatch();
    const [responseCode, setResponseCode] = useState<string>();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState<number>();
    useEffect(() => {
        console.log(window.location.href);
        const currentUrl = window.location.href;

        // Create a URL object
        const url = new URL(currentUrl);

        // Use URLSearchParams to get the query parameters
        const urlParams = new URLSearchParams(url.search);
        const amount = urlParams.get('vnp_Amount') as string;
        const bankTranNo = urlParams.get('vnp_BankTranNo') as string;
        const cartType = urlParams.get('vnp_CardType') as string;
        const payDate = urlParams.get('vnp_PayDate') as string;
        const orderId = urlParams.get('vnp_OrderInfo') as string;
        const bankCode = urlParams.get('vnp_BankCode') as string;
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode') as string;
        setOrderId(parseInt(orderId))
        const paymentPost: PaymentPost = {
            amount, bankCode, bankTranNo, cartType, payDate, orderId
        }
        setResponseCode(vnp_ResponseCode);
        if (vnp_ResponseCode == "00") {
            createPayment(paymentPost, orderId);
        }

    }, []);

    const createPayment = async (paymentPost: PaymentPost, orderId: string) => {
        try {
            const res = await savePayment(paymentPost);
            if (res.status == 200) {
                dispatch(getLearningCourse())
                console.log("save payment success");
                const orderIdNum = parseInt(orderId);
                const resOfUpdateOrderStatus = await updateOrderStatus(orderIdNum, "SUCCESS");
                if (resOfUpdateOrderStatus.status == 204) {
                    console.log("update order status success");
                }

            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                const orderIdNum = parseInt(orderId);
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                // alert(message);
                const resOfUpdateOrderStatus = await updateOrderStatus(orderIdNum, "CANCEL");
                if (resOfUpdateOrderStatus.status == 204) {
                    console.log("update order status cancel");
                }
            }
        }

    }
    const handleRedirectToOrderHistory = () => {
        navigate("/purchase-history")
    }
    const handleRedirectToHome = () => {
        navigate("/")
    }
    return <div className="vnpay-callback-container">
        {responseCode == "00" && <Result
            status="success"
            title="Thanh toán thành công"
            subTitle={`Mã đơn hàng: ${orderId}`}
            extra={[
                <Button type="primary" key="console" onClick={handleRedirectToOrderHistory}>
                    Về trang lịch sử mua hàng
                </Button>,
                <Button key="buy" onClick={handleRedirectToHome}>Mua tiếp</Button>,
            ]}
        />}
        {responseCode != "00" && <Result
            status="warning"
            title="There are some problems with your operation."
            extra={
                <Button type="primary" key="console">
                    Go Console
                </Button>
            }
        />}
    </div>;
}

export default VnPayCallback;