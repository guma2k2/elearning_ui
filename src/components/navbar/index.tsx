import { Link } from "react-router-dom"
import Logo from "../../assets/logo-udemy.svg"
import { BsCart, BsHeart } from "react-icons/bs"
import { MdOutlineNotifications, MdSearch } from "react-icons/md"
import './Navbar.style.scss'
import { useEffect, useRef, useState } from "react"
import PopperWrapper from "../popper/PopperWrapper"
import { Tooltip, TooltipRefProps } from 'react-tooltip'
function Navbar() {
    const [results, setResults] = useState<string[]>(["1", "2"])
    const searchTooltipRef = useRef<TooltipRefProps>(null)
    useEffect(() => {
        if (results.length > 0) {
            if (searchTooltipRef.current) {
                searchTooltipRef.current.open();
            }
        }
    }, [results])

    return (
        <div className="navbar-container" >
            <div className="left">
                <Link to={"/"} className="logo" >
                    <img src={Logo} alt="Logo image" />
                </Link>
                <div className="categories">Categories</div>

                <div className="search" data-tooltip-id="my-tooltip">
                    <div className="button"><MdSearch className="icon" /></div>
                    <input type="text" />
                </div>
                <Tooltip id="my-tooltip" className="search-tooltip" disableStyleInjection ref={searchTooltipRef} imperativeModeOnly>
                    <PopperWrapper>
                        <h3>This is a very interesting header</h3>
                        <p>Here's some interesting stuff:</p>
                        <ul>
                            <li>Some</li>
                            <li>Interesting</li>
                            <li>Stuff</li>
                        </ul>
                    </PopperWrapper>
                </Tooltip>
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