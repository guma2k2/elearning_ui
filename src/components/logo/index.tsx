import React from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../assets/img/logo.svg";
import "./Logo.style.scss";
const Logo = () => {
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate("/");
    };

    return (
        <div className="logo" onClick={navigateToHome}>
            <img src={icon} alt="" className="icon" />
            <strong className="logo__text">circuit</strong>
        </div>
    );
};

export default Logo;
