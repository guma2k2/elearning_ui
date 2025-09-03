import { AuthType, RegisterRequest } from "../../types/AuthType";
import { Link, useNavigate } from "react-router-dom";
import "./index.style.scss";
import { registerUser } from "../../services/AuthService";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../components/button";
import CancelIcon from "../../assets/cancel.svg";

function Register() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterRequest>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<RegisterRequest> = async (values) => {
        setLoading(true);
        try {
            setLoading(true);
            const res = await registerUser(values);
            if (res.status == 200) {
                alert("Vui lòng kiểm tra mail để hoàn tất đăng ký");
                reset();
                setLoading(false);
                navigate(`/verify/${values.email}/register`);
            }
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response);
                if (error.response.status == 400) {
                    reset();
                    console.log(error.response);
                    const message = error.response.data.details;
                    alert(message);
                    setLoading(false);

                    navigate(`/verify/${values.email}/register`);
                } else {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    setLoading(false);
                    alert(message);
                }
            }
            setLoading(false);
        }
    };

    return (
        <div className="register">
            <div className="row">
                <div className="col-6 d-lg-none">
                    <div className="register-left">
                        <div className="register-left__inner">
                            <h1 className="heading">Welcome Back to the online learning Circuit</h1>
                            <p className="desc">Sign up to learn something new and shine to your future career</p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-12">
                    <div className="register-right">
                        <div className="register-right__inner">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label htmlFor="firstName" className="form__label">
                                        First name
                                    </label>
                                    <input
                                        placeholder="First name"
                                        className="form__input"
                                        id="firstName"
                                        {...register("firstName", {
                                            required: {
                                                value: true,
                                                message: "First name is required",
                                            },
                                        })}
                                    />
                                    {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form__label">
                                        Last name
                                    </label>
                                    <input
                                        placeholder="Last name"
                                        className="form__input"
                                        id="lastName"
                                        type=""
                                        {...register("lastName", {
                                            required: {
                                                value: true,
                                                message: "Last name is required",
                                            },
                                        })}
                                    />
                                    {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                                </div>
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
                                    Sign Up
                                </Button>
                            </form>
                            <div className="action">
                                <span>
                                    Have an account? &nbsp;
                                    <Link to={"/login"} className="action__btn">
                                        Log In
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

export default Register;
