import { Button, Form, FormProps, Input } from 'antd'
import './index.style.scss'
import GoogleLogo from '../../assets/search.png'
import { OAuthConfig } from '../../utils/OauthConfig';
import { Link, useNavigate } from 'react-router-dom';
import { LoginRequest } from '../../types/AuthType';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { login } from '../../redux/slices/AuthenticationSlice';
import { useEffect } from 'react';

function Login() {

    const dispatch = useAppDispatch();
    const { isLoggin } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const onFinish: FormProps<LoginRequest>['onFinish'] = async (values) => {
        dispatch(login(values));

    };
    const onFinishFailed = () => {
        console.log('Failed:');
    };

    const handleLoginWithGoogle = () => {
        const callbackUrl = OAuthConfig.redirectUri;
        const authUrl = OAuthConfig.authUri;
        const googleClientId = OAuthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        console.log(targetUrl);

        window.location.href = targetUrl;
    }

    useEffect(() => {
        if (isLoggin) {
            navigate("/")
        }
    }, [isLoggin])
    return (
        <div className='login-container' >
            <div className="left">
                <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp" alt="image-background" />
            </div>
            <div className="right">
                <h2 className="header">
                    Log in to your Udemy account
                </h2>
                <div className="form">
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<LoginRequest>
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<LoginRequest>
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="bottom">
                    <div className="forgot-password-form">
                        <div className="forgot-password">
                            <span>hoặc <a href="avc.com">Quên mật khẩu</a></span>
                        </div>
                    </div>
                    <span className="separator">
                        <p>Các tùy chọn đăng nhập khác</p>
                    </span>
                    <div className="option">
                        <div className="button" onClick={handleLoginWithGoogle}>
                            <img src={GoogleLogo} alt="google logo" />
                        </div>
                    </div>
                    <div className="register">
                        <span>Bạn không có tài khoản? <Link to={"/register"}>Đăng ký</Link></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login