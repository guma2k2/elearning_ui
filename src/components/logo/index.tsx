import React from "react";
import { Link } from "react-router-dom";
import icon from "../../assets/img/logo.svg";
import "./Logo.style.scss";
const Logo = () => {
    return (
        <Link to={"/"} className="logo">
            <img src={icon} alt="" className="icon" />
            <strong className="logo__text">circuit</strong>
        </Link>
    );
};

export default Logo;
