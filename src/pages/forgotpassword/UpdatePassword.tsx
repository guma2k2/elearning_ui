import { Button, Form, FormProps, Input } from "antd";
import { ConfirmPassword, UpdatePasswordRequest } from "../../types/AuthType";
import { updatePassword } from "../../services/AuthService";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



function UpdatePassword() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const onFinish: FormProps<ConfirmPassword>['onFinish'] = async (values) => {
        setLoading(true);
        const pass = values.password;
        const confirmPass = values.confirmPassword;
        if (pass != confirmPass) {
            alert("Password and confirm password is not the same");
            setLoading(false)
        } else {
            const searchParams = new URLSearchParams(location.search);
            const email = searchParams.get('email');
            if (email) {
                try {
                    const updateRequest: UpdatePasswordRequest = {
                        email: email,
                        password: pass
                    }
                    const res = await updatePassword(updateRequest);
                    if (res.status == 204) {
                        alert("update password successful");
                        setLoading(false)

                        form.resetFields();
                        navigate("/login")
                    }
                } catch (error: AxiosError | any) {
                    if (error.response) {
                        console.log(error.response.data);
                        const data = error.response.data as ErrorType;
                        const message = data.details;
                        setLoading(false)

                        alert(message)
                    }
                }

            }

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
                Thay đổi mật khẩu
            </h2>
            <div className="form">
                <Form
                    disabled={loading}
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
                    <Form.Item<ConfirmPassword>
                        label="Password"
                        name="password"
                        style={{ width: "100%" }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Mật khẩu không được để trống',
                            },
                        ]}
                    >
                        <Input.Password style={{ width: "100%", height: "50px" }} />
                    </Form.Item>
                    <Form.Item<ConfirmPassword>
                        label="ConfirmPassword"
                        name="confirmPassword"
                        style={{ width: "100%" }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Mật khẩu không được để trống',
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
                        <Button disabled={loading} type="primary" htmlType="submit" style={{ width: "100%", height: "48px", borderRadius: "0", fontSize: "16px" }}>
                            Xác nhận thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
}

export default UpdatePassword;