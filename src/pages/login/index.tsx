import "./index.style.scss";
import CancelIcon from "../../assets/cancel.svg";
import GoogleIcon from "../../assets/Google.svg";

import { OAuthConfig } from "../../utils/OauthConfig";
import { Link, useNavigate } from "react-router-dom";
import { LoginRequest } from "../../types/AuthType";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { login } from "../../redux/slices/AuthenticationSlice";
import { useEffect, useState } from "react";
import { ROLE_ADMIN, ROLE_INSTRUCTOR } from "../../utils/Constants";
import { showToast } from "../../redux/slices/toastSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../components/button";
function Login() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const { isLoggin, auth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>();

    const onFinishFailed = () => {
        console.log("Failed:");
    };

    const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // dispatch(login(data));
        setLoading(false);
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
    };

    useEffect(() => {
        if (isLoggin === true) {
            if (auth) {
                const role = auth.user.role as string;
                if (role === ROLE_ADMIN || role === ROLE_INSTRUCTOR) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        }
    }, [isLoggin]);
    return (
        <div className="login">
            <div className="row">
                <div className="col-6 d-lg-none">
                    <div className="login-left">
                        <div className="login-left__inner">
                            <h1 className="heading">Welcome Back to the online learning Circuit</h1>
                            <p className="desc">Log In to learn something new and shine to your future career</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-12">
                    <div className="login-right">
                        <div className="login-right__inner">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label htmlFor="email" className="form__label">
                                        Email Address
                                    </label>
                                    <input
                                        placeholder="Email address"
                                        className="form__input"
                                        id="email"
                                        {...register("email", {
                                            required: {
                                                value: true,
                                                message: "Email is required",
                                            },
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Email is not valid",
                                            },
                                        })}
                                    />
                                    {errors.email && <span className="form-error">{errors.email.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form__label">
                                        Password
                                    </label>
                                    <input
                                        placeholder="Password"
                                        className="form__input"
                                        id="password"
                                        type="password"
                                        {...register("password", {
                                            required: true,
                                            minLength: {
                                                value: 6,
                                                message: "The password need at least 6 characters",
                                            },
                                        })}
                                    />
                                    {errors.password && <span className="form-error">{errors.password.message}</span>}
                                </div>
                                <Link to={"/forgotpassword"} className="forgot-password">
                                    Forgot Password ?
                                </Link>
                                <Button variant="primary" type="submit" className="form__btn" loading={loading}>
                                    Log In
                                </Button>
                            </form>
                            <div className="separate"></div>
                            <Button
                                variant="outline"
                                className="form-social__btn"
                                onClick={handleLoginWithGoogle}
                                leftIcon={<img src={GoogleIcon} alt="" className="social__icon" />}
                            >
                                <span>Continue with Google</span>
                            </Button>
                            <div className="action">
                                <span>
                                    Don't have an account?{" "}
                                    <Link to={"/register"} className="action__btn">
                                        Sign Up
                                    </Link>
                                </span>
                            </div>
                            <Link to={"/"}>
                                <img src={CancelIcon} alt="" className="form__cancel" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

// <div className='login-container' >
// <div className="left">
//     <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp" alt="image-background" />
// </div>
// <div className="right">
//     <h2 className="header">
//         Đăng nhập
//     </h2>
//     <div className="form">
//         <Form
//             disabled={loading}
//             layout='vertical'
//             name="basic"
//             labelCol={{
//                 span: 8,
//             }}
//             wrapperCol={{
//                 span: 16,
//             }}
//             style={{
//                 maxWidth: "100%",
//             }}
//             initialValues={{
//                 remember: true,
//             }}
//             onFinish={onFinish}
//             onFinishFailed={onFinishFailed}
//             autoComplete="off"
//         >
//             <Form.Item<LoginRequest>
//                 label="Email"
//                 name="email"
//                 style={{ width: "100%" }}
//                 wrapperCol={{
//                     span: 24,
//                 }}
//                 rules={[
//                     {
//                         required: true,
//                         message: 'Please input your email!',
//                     },
//                 ]}
//             >
//                 <Input style={{ width: "100%", height: "50px" }} />
//             </Form.Item>

//             <Form.Item<LoginRequest>
//                 label="Mật khẩu"
//                 name="password"
//                 style={{ width: "100%" }}
//                 wrapperCol={{
//                     span: 24,
//                 }}
//                 rules={[
//                     {
//                         required: true,
//                         message: 'Please input your password!',
//                     },
//                 ]}
//             >
//                 <Input.Password style={{ width: "100%", height: "50px" }} />
//             </Form.Item>
//             <Form.Item
//                 wrapperCol={{
//                     span: 24,
//                 }}
//             >
//                 <Button type="primary" htmlType="submit" style={{ width: "100%", height: "48px", borderRadius: "0", fontSize: "16px" }}>
//                     Đăng nhập
//                 </Button>
//             </Form.Item>
//         </Form>
//     </div>
//     <div className="bottom">
//         <div className="forgot-password-form">
//             <div className="forgot-password">
//                 <span>hoặc <Link to={"/forgotpassword"}>Quên mật khẩu</Link></span>
//             </div>
//         </div>
//         <span className="separator">
//             <p>Các tùy chọn đăng nhập khác</p>
//         </span>
//         <div className="option">
//             <div className="button" onClick={handleLoginWithGoogle}>
//                 <img src={GoogleLogo} alt="google logo" />
//             </div>
//         </div>
//         <div className="register">
//             <span>Bạn không có tài khoản? <Link to={"/register"}>Đăng ký</Link></span>
//         </div>
//     </div>
// </div>
// </div>
