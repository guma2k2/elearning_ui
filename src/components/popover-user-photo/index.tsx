import { Divider } from "antd";
import UserPhoto from "../../assets/userPhoto.png"
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logOut } from "../../redux/slices/AuthenticationSlice";
import { resetCart } from "../../redux/slices/CartSlice";
import { resetLearningCoures } from "../../redux/slices/LearningCourseSlice";
import { RootState } from "../../redux/store";
import { Fragment } from "react";
function PopoverUserProfile() {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("handle logout");
        dispatch(logOut());
        dispatch(resetCart());
        dispatch(resetLearningCoures());
        if (window.location.pathname !== "/") {
            navigate("/")
        }
    }
    console.log(auth);

    return <div className="popover-user-profile-container">
        <div className="popover-user-profile-top">
            <div className="popover-user-profile-top-left">
                <img src={auth?.user.photoURL ? auth.user.photoURL : UserPhoto} alt="user-profile" />
            </div>
            <div className="popover-user-profile-top-right">
                <span className="user-profile-fullname">{auth?.user.firstName.concat(auth?.user.lastName)}</span>
                <span className="user-profile-email">{auth?.user.email}</span>
            </div>
        </div>
        {auth?.user.role == "ROLE_STUDENT" && <Fragment>
            <Divider className="popover-profile-devider" />
            <div className="popover-user-profile-middle">
                <Link className="popover-profile-link-redirect" to={"/cart"}> <span>Giỏ hàng của tôi</span> </Link>
                <Link className="popover-profile-link-redirect" to={"/my-learning"}> <span>Học tập</span> </Link>
                <Link className="popover-profile-link-redirect" to={"/purchase-history"}> <span>Lịch sử mua hàng</span> </Link>
            </div>
        </Fragment>}
        <Divider className="popover-profile-devider" />
        <div className="popover-user-profile-bottom">
            <Link className="popover-profile-link-redirect" to={auth?.user.role == "ROLE_STUDENT" ? "/profile" : "/admin/profile"}> <span>Cài đặt</span> </Link>
            <div onClick={handleLogout} className="popover-profile-link-redirect" > <span>Đăng xuất</span> </div>
        </div>
    </div>;
}

export default PopoverUserProfile;