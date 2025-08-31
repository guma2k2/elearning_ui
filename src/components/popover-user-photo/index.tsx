import { Divider } from "antd";
import UserPhoto from "../../assets/userPhoto.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logOut } from "../../redux/slices/AuthenticationSlice";
import { resetCart } from "../../redux/slices/CartSlice";
import { resetLearningCoures } from "../../redux/slices/LearningCourseSlice";
import { RootState } from "../../redux/store";
import { Fragment } from "react";
import { clearToast } from "../../redux/slices/toastSlice";
import { toggleTheme } from "../../redux/slices/ThemeSlice";
import { FiShoppingCart, FiBookOpen, FiClock, FiMoon, FiSun, FiSettings, FiLogOut, FiUser } from "react-icons/fi";
function PopoverUserProfile() {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const { type } = useAppSelector((state: RootState) => state.theme);
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("handle logout");
        dispatch(logOut());
        dispatch(resetCart());
        dispatch(resetLearningCoures());
        dispatch(clearToast());

        if (window.location.pathname !== "/") {
            navigate("/");
        }
    };
    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    return (
        <div className="popover-user-profile-container">
            <div className="popover-user-profile-top">
                <div className="popover-user-profile-top-left">
                    <img src={auth?.user.photoURL ? auth.user.photoURL : UserPhoto} alt="user-profile" />
                </div>
                <div className="popover-user-profile-top-right">
                    <span className="user-profile-fullname">
                        {auth?.user.firstName} {auth?.user.lastName}
                    </span>
                    <span className="user-profile-email">{auth?.user.email}</span>
                </div>
            </div>

            {auth?.user.role === "ROLE_STUDENT" && (
                <Fragment>
                    <Divider className="popover-profile-divider" />
                    <div className="popover-user-profile-middle">
                        <Link className="popover-profile-link-redirect" to="/cart">
                            <FiShoppingCart className="item-icon" />
                            <span>Giỏ hàng của tôi</span>
                        </Link>
                        <Link className="popover-profile-link-redirect" to="/my-learning">
                            <FiBookOpen className="item-icon" />
                            <span>Học tập</span>
                        </Link>
                        <Link className="popover-profile-link-redirect" to="/purchase-history">
                            <FiClock className="item-icon" />
                            <span>Lịch sử mua hàng</span>
                        </Link>
                    </div>
                </Fragment>
            )}

            <Divider className="popover-profile-divider" />
            <div className="popover-user-profile-bottom">
                <button onClick={handleToggleTheme} className="popover-profile-link-redirect" type="button">
                    {type !== "dark" ? <FiMoon className="item-icon" /> : <FiSun className="item-icon" />}
                    <span>{type !== "dark" ? "Dark mode" : "Light mode"}</span>
                </button>

                <Link
                    className="popover-profile-link-redirect"
                    to={auth?.user.role === "ROLE_STUDENT" ? "/profile" : "/admin/profile"}
                >
                    <FiSettings className="item-icon" />
                    <span>Cài đặt</span>
                </Link>

                <button onClick={handleLogout} className="popover-profile-link-redirect" type="button">
                    <FiLogOut className="item-icon" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default PopoverUserProfile;
