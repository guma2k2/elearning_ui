import "./Forgotpassword.style.scss";
import { ForgotPasswordRequest } from "../../types/AuthType";
import { forgotPassword } from "../../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { showMessage } from "../../utils/MessageUtil";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Button from "../../components/button";

function ForgotPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordRequest>();

    const onSubmit: SubmitHandler<ForgotPasswordRequest> = async (values) => {
        setLoading(true);
        const res = await forgotPassword(values);
        if (res.status == 204) {
            navigate(`/verify/${values.email}/forgot`);
            showMessage("Please check email to change password", "success");
        }
        setLoading(false);
    };

    return (
        <div className="forgot">
            <div className="row">
                <div className="col-6 d-lg-none">
                    <div className="forgot-left">
                        <div className="forgot-left__inner">
                            <h1 className="heading">Welcome Back to the online learning Circuit</h1>
                            <p className="desc">Log In to learn something new and shine to your future career</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-12">
                    <div className="forgot-right">
                        <div className="forgot-right__inner">
                            <h2 className="heading">Forgot Password</h2>
                            <p className="desc">
                                Enter your email below and we’ll send you instructions on how to reset your password.
                            </p>
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
                                <Button variant="primary" type="submit" className="form__btn" loading={loading}>
                                    Log In
                                </Button>
                            </form>
                            <div className="action">
                                <Link to={"/register"} className="action__btn">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

// <div className="forgotPassword-container">
// <div className="left">
//     <img
//         src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp"
//         alt="image-background"
//     />
// </div>
// <div className="right">
//     <h2 className="header">Quên mật khẩu</h2>
//     <div className="form">
//         <Form
//             layout="vertical"
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
//             autoComplete="off"
//         >
//             <Form.Item<ForgotPasswordRequest>
//                 label="Email"
//                 name="email"
//                 style={{ width: "100%" }}
//                 wrapperCol={{
//                     span: 24,
//                 }}
//                 rules={[
//                     {
//                         required: true,
//                         message: "Please input your email!",
//                     },
//                 ]}
//             >
//                 <Input style={{ width: "100%", height: "50px" }} />
//             </Form.Item>

//             <Form.Item
//                 wrapperCol={{
//                     span: 24,
//                 }}
//             >
//                 <Button
//                     type="primary"
//                     htmlType="submit"
//                     style={{ width: "100%", height: "48px", borderRadius: "0", fontSize: "16px" }}
//                 >
//                     Xác nhận
//                 </Button>
//             </Form.Item>
//         </Form>
//     </div>
// </div>
// </div>
