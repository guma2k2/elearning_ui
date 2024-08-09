import { Button, Form, FormProps, Input } from "antd";
import './Forgotpassword.style.scss'
import { ForgotPasswordRequest } from "../../types/AuthType";
import { forgotPassword } from "../../services/AuthService";

function ForgotPassword() {
    const onFinish: FormProps<ForgotPasswordRequest>['onFinish'] = async (values) => {
        const res = await forgotPassword(values);
        if (res.status == 204) {
            alert("Please check email to change password")
        }
    };
    const onFinishFailed = () => {
        console.log('Failed:');
    };
    return <div className='forgotPassword-container' >
        <div className="left">
            <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp" alt="image-background" />
        </div>
        <div className="right">
            <h2 className="header">
                Quên mật khẩu
            </h2>
            <div className="form">
                <Form
                    layout='vertical'
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: "100%",
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<ForgotPasswordRequest>
                        label="Email"
                        name="email"
                        style={{ width: "100%" }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input style={{ width: "100%", height: "50px" }} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Button type="primary" htmlType="submit" style={{ width: "100%", height: "48px", borderRadius: "0", fontSize: "16px" }}>
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
}

export default ForgotPassword;