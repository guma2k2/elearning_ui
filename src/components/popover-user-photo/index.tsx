import { Divider } from "antd";
import UserPhoto from "../../assets/userPhoto.png"
import { Link } from "react-router-dom";
function PopoverUserProfile() {
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
            <Link className="popover-profile-link-redirect" to={""}> <span>Gio hang cua toi</span> </Link>
            <Link className="popover-profile-link-redirect" to={""}> <span>Hoc tap</span> </Link>
            <Link className="popover-profile-link-redirect" to={""}> <span>Lich su mua hang</span> </Link>
        </div>
        <Divider className="popover-profile-devider" />
        <div className="popover-user-profile-bottom">
            <Link className="popover-profile-link-redirect" to={""}> <span>Cai Dat</span> </Link>
            <Link className="popover-profile-link-redirect" to={""}> <span>Dang xuat</span> </Link>
        </div>
    </div>;
}

export default PopoverUserProfile;