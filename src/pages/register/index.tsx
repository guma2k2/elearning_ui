
import { Button, Form, FormProps, Input } from "antd";
import { AuthType, RegisterRequest } from "../../types/AuthType";
import { Link } from "react-router-dom";
import './index.style.scss'
import { registerUser } from "../../services/AuthService";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";
import { useForm } from "antd/es/form/Form";
function Register() {
    const [form] = Form.useForm();
    const onFinish: FormProps<RegisterRequest>['onFinish'] = async (values) => {
        try {
            const res = await registerUser(values);
            if (res.status == 200) {
                const data = res.data as AuthType;
                alert("Register successful")
                form.resetFields();
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message)
            }
        }

    };
    const onFinishFailed = () => {
        console.log('Failed:');
    };
    return <div className="register-container">
        <div className="left">
            <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp" alt="image-background" />
        </div>
        <div className="right">
            <h2 className="header">
                Đăng ký và bắt đầu học
            </h2>
            <div className="form">
                <Form
                    form={form}
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
                    <Form.Item<RegisterRequest>
                        label="Họ"
                        name="firstName"
                        style={{ width: "100%" }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your firstName!',
                            },
                        ]}
                    >
                        <Input style={{ width: "100%", height: "50px" }} />
                    </Form.Item>
                    <Form.Item<RegisterRequest>
                        label="Tên"
                        name="lastName"
                        style={{ width: "100%" }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your lastName!',
                            },
                        ]}
                    >
                        <Input style={{ width: "100%", height: "50px" }} />
                    </Form.Item>
                    <Form.Item<RegisterRequest>
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

                    <Form.Item<RegisterRequest>
                        label="Mật khẩu"
                        name="password"
                        style={{ width: "100%" }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password style={{ width: "100%", height: "50px" }} />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Button type="primary" htmlType="submit" style={{ width: "100%", height: "48px", borderRadius: "0", fontSize: "16px" }}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="bottom">
                <div className="register">
                    <span>Bạn đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link></span>
                </div>
            </div>
        </div>
    </div>
}

export default Register;