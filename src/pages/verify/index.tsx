import { Button, Form, Input } from "antd";
import { VerifyRequest } from "../../types/AuthType";
import { useNavigate, useParams } from "react-router-dom";
import { resend, verifyEmail } from "../../services/AuthService";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";
import { useEffect, useState } from "react";
import './Verify.style.scss'
function Verify() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [btnStatus, setBtnStatus] = useState<boolean>(false);
    let { email, type } = useParams();
    const [timeLeft, setTimeLeft] = useState<number>(900);
    useEffect(() => {
        if (timeLeft <= 0) {
            setBtnStatus(true);
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId); // Cleanup interval on unmount
    }, [timeLeft]);

    const handleResend = async () => {
        setBtnStatus(false);
        setTimeLeft(900);

        if (email) {
            try {
                const resUpdateUser = await resend(email);
                if (resUpdateUser.status === 200) {
                    alert("Vui long kiem tra email");
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                }
            }
        }
    }
    const onFinish = async (values: VerifyRequest) => {
        if (email && type) {
            const newValues: VerifyRequest = {
                ...values,
                email: email,
                type: type
            }
            console.log(newValues);

            try {
                const resUpdateUser = await verifyEmail(newValues);
                if (resUpdateUser.status === 200) {
                    alert("Verify success");
                    if (type) {
                        if (type == "register") {
                            navigate("/login")
                        } else if (type == "forgot") {
                            const enscryptPass = resUpdateUser.data;
                            navigate(`/password-confirm?email=${enscryptPass}`)
                        }

                    }
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                }
            }
        }
    }
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const timeStyles = {
        timerContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '200px',
            height: '100px',
            background: '#f3f3f3',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            margin: "0 auto"
        },
        timerText: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#333',
            margin: 0,
        },
    };
    return <div className="verify-container">
        <h2 className='profile-header'>Xác nhận email</h2>
        <div style={timeStyles.timerContainer}>
            <p style={timeStyles.timerText}>{formatTime(timeLeft)}</p>
        </div>
        <Form
            layout={"vertical"}
            form={form}
            onFinish={onFinish}
        >
            <Form.Item label="Mã xác nhận" name="verificationCode" rules={[{ required: true, message: 'Mã xác nhận không được bỏ trống' }]}>
                <Input placeholder="Nhập mã xác nhận" />
            </Form.Item>

        </Form>
        <div className="verify-bottom">
            <Button onClick={() => form.submit()} type="primary" disabled={btnStatus}>Xác nhận</Button>
            <Button style={{ marginLeft: "20px" }} onClick={handleResend} type="primary">Gửi lại</Button>
        </div>
    </div>
}

export default Verify;