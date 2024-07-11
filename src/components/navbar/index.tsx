import { Link, useNavigate } from "react-router-dom"
import Logo from "../../assets/logo-udemy.svg"
import UserPhoto from "../../assets/userPhoto.png"
import { BsCart, BsHeart } from "react-icons/bs"
import { MdOutlineKeyboardArrowRight, MdOutlineNotifications, MdSearch } from "react-icons/md"
import './Navbar.style.scss'
import { useEffect, useRef, useState } from "react"
import PopperWrapper from "../popper/PopperWrapper"
import { Tooltip, TooltipRefProps } from 'react-tooltip'
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"
import { fetchCategoryParents } from "../../redux/slices/CategorySlice"
import { Button, Popover } from "antd"
import PopoverCart from "../popover-cart"
import PopoverUserProfile from "../popover-user-photo"
import PopoverLearning from "../popover-learning"

function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);
    const [results, setResults] = useState<string[]>([])
    const [cartTotal, setCartTotal] = useState<number>(11);
    const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
    const searchTooltipRef = useRef<TooltipRefProps>(null)
    const topicTooltipRef = useRef<TooltipRefProps>(null)
    const childCategoryTooltipRef = useRef<TooltipRefProps>(null)
    const categoryRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState<boolean>(false);
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const [openLearning, setOpenLearning] = useState<boolean>(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const handleOpenProfileChange = (newOpen: boolean) => {
        setOpenProfile(newOpen);
    };
    const handleOpenLearning = (newOpen: boolean) => {
        setOpenLearning(newOpen);
    };
    const handleShowTopics = (childId: number) => {
        console.log(childId);
        let xCategoryTooltipPosition: number = 0;
        if (categoryRef.current) {
            const { x } = categoryRef.current.getBoundingClientRect();
            xCategoryTooltipPosition = x * 2;
        }
        // Todo: get topics by categoryChildId
        if (topicTooltipRef.current) {
            const index = 0;
            const childrens: CategoryType[] = categoryParents ? categoryParents[index].childrens : [];
            const html = childrens.length > 0 && childrens.map((child) => {
                return <div key={child.id} className="category-item" onMouseEnter={() => handleShowTopics(child.id)}>
                    <span>{child.name}</span>
                    <MdOutlineKeyboardArrowRight />
                </div>
            })
            topicTooltipRef.current.open({
                content: <PopperWrapper>{html}</PopperWrapper>,
                position: {
                    x: xCategoryTooltipPosition + 255 * 2,
                    y: 46
                },
            }
            )
        }

    }
    const handleShowCategoryChildTooltip = (parentId: number) => {
        console.log(parentId);
        let xCategoryTooltipPosition: number = 0;
        if (categoryRef.current) {
            const { x } = categoryRef.current.getBoundingClientRect();
            xCategoryTooltipPosition = x * 2;
        }
        if (childCategoryTooltipRef.current) {
            const index: number = parentId;
            const childrens: CategoryType[] = categoryParents ? categoryParents[index].childrens : [];
            const html = childrens.length > 0 && childrens.map((child) => {
                return <div key={child.id} className="category-item" onMouseEnter={() => handleShowTopics(child.id)}>
                    <span>{child.name}</span>
                    <MdOutlineKeyboardArrowRight />
                </div>
            })
            childCategoryTooltipRef.current.open({
                content: <PopperWrapper>{html}</PopperWrapper>,
                position: {
                    x: xCategoryTooltipPosition + 255,
                    y: 46
                },
            }
            )
        }

    }
    const handleRedirectToLogin = () => {
        navigate("/login")
    }

    const handleRedirectToRegister = () => {
        navigate("/login")
    }
    const getCartTotal = (): string => {
        if (cartTotal > 9) {
            return 9 + "+";
        }
        return cartTotal + "";
    }
    useEffect(() => {
        if (results.length > 0) {
            if (searchTooltipRef.current) {
                searchTooltipRef.current.open();
            }
        }
    }, [results])

    useEffect(() => {
        dispatch(fetchCategoryParents());
    }, [])

    return (
        <>
            <div className="navbar-top-container" >
                <div className="left">
                    <Link to={"/"} className="logo" >
                        <img src={Logo} alt="Logo image" />
                    </Link>
                    <div className="categories"
                        data-tooltip-id="category-tooltip"
                        ref={categoryRef}
                        onMouseEnter={() => setCategoryOpen(true)}

                    >Thể loại</div>
                    <Tooltip id="category-tooltip"
                        place="bottom-end"
                        className="category-tooltip"
                        disableStyleInjection
                        imperativeModeOnly
                        clickable
                        offset={18}
                        isOpen={categoryOpen}
                    >
                        <PopperWrapper >
                            {categoryParents?.map((item, index) => {
                                return <div key={item.id} className="category-item"
                                    data-tooltip-id="category-child-tooltip"
                                    onMouseEnter={() => handleShowCategoryChildTooltip(index)}
                                >
                                    <span>{item.name}</span>
                                    <MdOutlineKeyboardArrowRight />
                                </div>
                            })}
                        </PopperWrapper>
                    </Tooltip>
                    <Tooltip
                        className="category-child-tooltip"
                        id="category-child-tooltip"
                        isOpen={categoryOpen}
                        offset={18}
                        imperativeModeOnly
                        disableStyleInjection
                        ref={childCategoryTooltipRef}
                        clickable
                        afterShow={() => handleShowCategoryChildTooltip(0)}
                    />
                    <Tooltip
                        className="topic-tooltip"
                        id="topic-tooltip"
                        ref={topicTooltipRef}
                        offset={18}
                        imperativeModeOnly
                        disableStyleInjection
                        clickable
                        afterHide={() => setCategoryOpen(false)}
                    />
                    <div className="search" data-tooltip-id="my-tooltip">
                        <div className="button"><MdSearch className="icon" /></div>
                        <input type="text" placeholder="Tìm kiếm khóa học" />
                    </div>
                    <Tooltip id="my-tooltip" className="search-tooltip"
                        disableStyleInjection
                        ref={searchTooltipRef} imperativeModeOnly>
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
                    {isLoggin == false && <>
                        <Popover
                            placement="bottomRight"
                            content={PopoverLearning}
                            rootClassName="popover-learnings"
                            trigger="click"
                            open={openLearning}
                            onOpenChange={handleOpenLearning}
                        >
                            <div className="learnings">Khoa hoc cua toi</div>
                        </Popover>
                        <BsHeart className="icon" />
                    </>}

                    <div className="cart" >
                        <Popover
                            placement="bottomRight"
                            content={PopoverCart}
                            rootClassName="popover-carts"
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}
                        >
                            <BsCart className="icon-cart"></BsCart>
                        </Popover>
                        {cartTotal > 0 && <span className="cart-number">{getCartTotal()}</span>}
                    </div>

                    {isLoggin == false && <>
                        <div className="notification"><MdOutlineNotifications className="icon" /></div>
                        {/* <img src={auth?.photoURL} alt="Photo" className="profile" /> */}
                        <Popover
                            content={PopoverUserProfile}
                            rootClassName="popover-profiles"
                            trigger="click"
                            open={openProfile}
                            placement="bottomLeft"
                            onOpenChange={handleOpenProfileChange}
                        >
                            <img src={UserPhoto} alt="Photo" className="profile" />
                        </Popover>
                    </>
                    }
                    {
                        isLoggin == true && <>
                            <Button onClick={handleRedirectToLogin} style={{ borderRadius: "0", height: "40px", padding: "0 12px", fontSize: "14px", fontWeight: "500", border: "1px solid #2d2f31" }}>Đăng nhập</Button>
                            <Button onClick={handleRedirectToRegister} style={{ borderRadius: "0", height: "40px", padding: "0 12px", fontSize: "14px", fontWeight: "500", border: "1px solid #2d2f31" }}>Đăng ký</Button>
                        </>
                    }

                </div>
            </div>
        </>
    )
}

export default Navbar