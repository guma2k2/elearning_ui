import { Button, Result } from "antd";
import { useEffect, useState } from "react";
import { PaymentPost } from "../../types/PaymentType";
import { savePayment } from "../../services/PaymentService";
import { OrderStatus, updateOrderStatus } from "../../services/OrderService";

function VnPayCallback() {

    const [responseCode, setResponseCode] = useState<string>();
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

        const paymentPost: PaymentPost = {
            amount, bankCode, bankTranNo, cartType, payDate, orderId
        }

        if (vnp_ResponseCode == "00") {
            createPayment(paymentPost, orderId);
        }
        setResponseCode(vnp_ResponseCode);
    }, []);

    const createPayment = async (paymentPost: PaymentPost, orderId: string) => {
        const res = await savePayment(paymentPost);
        if (res.status == 200) {
            console.log("save payment success");
            const orderIdNum = parseInt(orderId);


            const resOfUpdateOrderStatus = await updateOrderStatus(orderIdNum, "SUCCESS");
            if (resOfUpdateOrderStatus.status == 204) {
                console.log("update order status success");
            }
        }
    }
    return <div className="vnpay-callback-container">
        {responseCode == "00" && <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
                <Button type="primary" key="console">
                    Go Console
                </Button>,
                <Button key="buy">Buy Again</Button>,
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