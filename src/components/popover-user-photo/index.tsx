import { Divider } from "antd";
import UserPhoto from "../../assets/userPhoto.png"
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { logOut } from "../../redux/slices/AuthenticationSlice";
import { resetCart } from "../../redux/slices/CartSlice";
import { resetLearningCoures } from "../../redux/slices/LearningCourseSlice";
function PopoverUserProfile() {
    const dispatch = useAppDispatch();
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
    return <div className="popover-user-profile-container">
        <div className="popover-user-profile-top">
            <div className="popover-user-profile-top-left">
                <img src={UserPhoto} alt="user-profile" />
            </div>
            <div className="popover-user-profile-top-right">
                <span className="user-profile-fullname">Ngo Thuan</span>
                <span className="user-profile-email">thuanngo3072002@gmail.com</span>
            </div>
        </div>
        <Divider className="popover-profile-devider" />
        <div className="popover-user-profile-middle">
            <Link className="popover-profile-link-redirect" to={""}> <span>Giỏ hàng của tôi</span> </Link>
            <Link className="popover-profile-link-redirect" to={""}> <span>Học tập</span> </Link>
            <Link className="popover-profile-link-redirect" to={""}> <span>Lịch sử mua hàng</span> </Link>
        </div>
        <Divider className="popover-profile-devider" />
        <div className="popover-user-profile-bottom">
            <Link className="popover-profile-link-redirect" to={""}> <span>Cài đặt</span> </Link>
            <div onClick={handleLogout} className="popover-profile-link-redirect" > <span>Đăng xuất</span> </div>
        </div>
    </div>;
}

export default PopoverUserProfile;