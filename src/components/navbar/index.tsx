import { Link } from "react-router-dom"
import Logo from "../../assets/logo-udemy.svg"
import { BsCart, BsHeart } from "react-icons/bs"
import { MdOutlineNotifications, MdSearch } from "react-icons/md"
import './Navbar.style.scss'
function Navbar() {
    return (
        <div className="navbar-container" >
            <div className="left">
                <Link to={"/"} className="logo" >
                    <img src={Logo} alt="Logo image" />
                </Link>
                <div className="categories">Categories</div>
                <div className="search">
                    <div className="button"><MdSearch className="icon" /></div>
                    <input type="text" />

                </div>
            </div>
            <div className="right">
                <div className="learnings">My learning</div>
                <BsHeart className="icon" />
                <div className="cart"><BsCart className="icon" /></div>
                <div className="notification"><MdOutlineNotifications className="icon" /></div>
                <div className="profile"></div>
            </div>
        </div>
    )
}

export default Navbar