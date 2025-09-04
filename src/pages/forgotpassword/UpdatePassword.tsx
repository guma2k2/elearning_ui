import { ConfirmPassword, UpdatePasswordRequest } from "../../types/AuthType";
import { updatePassword } from "../../services/AuthService";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../components/button";
import "./Forgotpassword.style.scss";

function UpdatePassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ConfirmPassword>();

    const onSubmit: SubmitHandler<ConfirmPassword> = async (values) => {
        setLoading(true);
        setLoading(true);
        const pass = values.password;
        const confirmPass = values.confirmPassword;
        if (pass != confirmPass) {
            alert("Password and confirm password is not the same");
            setLoading(false);
        } else {
            const searchParams = new URLSearchParams(location.search);
            const email = searchParams.get("email");
            if (email) {
                try {
                    const updateRequest: UpdatePasswordRequest = {
                        email: email,
                        password: pass,
                    };
                    const res = await updatePassword(updateRequest);
                    if (res.status == 204) {
                        alert("update password successful");
                        setLoading(false);
                        reset();
                        navigate("/login");
                    }
                } catch (error: AxiosError | any) {
                    if (error.response) {
                        console.log(error.response.data);
                        const data = error.response.data as ErrorType;
                        const message = data.details;
                        setLoading(false);

                        alert(message);
                    }
                }
            }
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
                            <form onSubmit={handleSubmit(onSubmit)}>
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

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form__label">
                                        Confirm Password
                                    </label>
                                    <input
                                        placeholder="Password"
                                        className="form__input"
                                        id="confirmPassword"
                                        type="password"
                                        {...register("confirmPassword", {
                                            required: true,
                                            minLength: {
                                                value: 6,
                                                message: "The password need at least 6 characters",
                                            },
                                        })}
                                    />
                                    {errors.password && <span className="form-error">{errors.password.message}</span>}
                                </div>
                                <Button variant="primary" type="submit" className="form__btn" loading={loading}>
                                    Log In
                                </Button>
                            </form>

                            <div className="action">
                                <span>
                                    <Link to={"/register"} className="action__btn">
                                        Back to log in
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePassword;

// <div className='forgotPassword-container' >
//         <div className="left">
//             <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp" alt="image-background" />
//         </div>
//         <div className="right">
//             <h2 className="header">
//                 Thay đổi mật khẩu
//             </h2>
//             <div className="form">
//                 <Form
//                     disabled={loading}
//                     form={form}
//                     layout='vertical'
//                     name="basic"
//                     labelCol={{
//                         span: 8,
//                     }}
//                     wrapperCol={{
//                         span: 16,
//                     }}
//                     style={{
//                         maxWidth: "100%",
//                     }}
//                     initialValues={{
//                         remember: true,
//                     }}
//                     onFinish={onFinish}
//                     onFinishFailed={onFinishFailed}
//                     autoComplete="off"
//                 >
//                     <Form.Item<ConfirmPassword>
//                         label="Password"
//                         name="password"
//                         style={{ width: "100%" }}
//                         wrapperCol={{
//                             span: 24,
//                         }}
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Mật khẩu không được để trống',
//                             },
//                         ]}
//                     >
//                         <Input.Password style={{ width: "100%", height: "50px" }} />
//                     </Form.Item>
//                     <Form.Item<ConfirmPassword>
//                         label="ConfirmPassword"
//                         name="confirmPassword"
//                         style={{ width: "100%" }}
//                         wrapperCol={{
//                             span: 24,
//                         }}
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Mật khẩu không được để trống',
//                             },
//                         ]}
//                     >
//                         <Input.Password style={{ width: "100%", height: "50px" }} />
//                     </Form.Item>
//                     <Form.Item
//                         wrapperCol={{
//                             span: 24,
//                         }}
//                     >
//                         <Button disabled={loading} type="primary" htmlType="submit" style={{ width: "100%", height: "48px", borderRadius: "0", fontSize: "16px" }}>
//                             Xác nhận thay đổi
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </div>
//         </div>
//     </div>
