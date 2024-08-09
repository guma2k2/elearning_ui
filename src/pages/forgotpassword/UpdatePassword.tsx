import { Button, Form, FormProps, Input } from "antd";
import { ConfirmPassword, UpdatePasswordRequest } from "../../types/AuthType";
import { updatePassword } from "../../services/AuthService";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";



function UpdatePassword() {
    const onFinish: FormProps<ConfirmPassword>['onFinish'] = async (values) => {
        const pass = values.password;
        const confirmPass = values.confirmPassword;
        if (pass != confirmPass) {
            alert("Password and confirm password is not the same");
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
                Change password
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
                                message: 'Please input your email!',
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
                                message: 'Please input your email!',
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
                            Xac nhan thay doi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
}

export default UpdatePassword;