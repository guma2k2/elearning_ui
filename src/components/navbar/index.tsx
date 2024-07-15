import { Link, useNavigate } from "react-router-dom"
import Logo from "../../assets/logo-udemy.svg"
import { PiShoppingCartLight } from "react-icons/pi";
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
import PopoverSearch from "../popover-search"

function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);
    const [results, setResults] = useState<string[]>([])
    const { carts } = useAppSelector((state: RootState) => state.carts);
    const cartTotal = carts ? carts.length : 0;
    const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
    const topicTooltipRef = useRef<TooltipRefProps>(null)
    const childCategoryTooltipRef = useRef<TooltipRefProps>(null)
    const categoryRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState<boolean>(false);
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const [openLearning, setOpenLearning] = useState<boolean>(false);

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
        navigate("/register")
    }
    const getCartTotal = (): string => {
        if (cartTotal > 9) {
            return 9 + "+";
        }
        return cartTotal + "";
    }
    useEffect(() => {
        if (results.length > 0) {

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

                    <Popover
                        placement="bottom"
                        content={PopoverSearch}
                        rootClassName="popover-search"
                        open={results.length > 0}
                    >
                        <div className="search" >
                            <div className="button"><MdSearch className="icon" /></div>
                            <input type="text" placeholder="Tìm kiếm khóa học" />
                        </div>
                    </Popover>
                </div>
                <div className="right">
                    {isLoggin == true && <>
                        <Popover
                            placement="bottomRight"
                            content={PopoverLearning}
                            rootClassName="popover-learnings"
                            trigger="click"
                            open={openLearning}
                            onOpenChange={handleOpenLearning}
                        >
                            <div className="learnings">Khóa học của tôi</div>
                        </Popover>
                    </>}

                    <div className="cart" >
                        {isLoggin == true && <> <Popover
                            placement="bottomRight"
                            content={PopoverCart}
                            rootClassName="popover-carts"
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}
                        >
                            <PiShoppingCartLight className="icon-cart"></PiShoppingCartLight>
                        </Popover>
                            {cartTotal > 0 && <span className="cart-number">{getCartTotal()}</span>}</>}

                    </div>

                    {isLoggin == true && <>
                        <div className="notification"><MdOutlineNotifications className="icon" /></div>

                        <Popover
                            content={PopoverUserProfile}
                            rootClassName="popover-profiles"
                            trigger="click"
                            open={openProfile}
                            placement="bottomLeft"
                            onOpenChange={handleOpenProfileChange}
                        >
                            <img src={auth?.user.photoURL} alt="Photo" className="profile" />
                        </Popover>
                    </>
                    }
                    {
                        isLoggin == false && <>
                            <Button onClick={handleRedirectToLogin} style={{ borderRadius: "0", height: "40px", padding: "0 12px", fontSize: "14px", fontWeight: "700", border: "1px solid #2d2f31" }}>Đăng nhập</Button>
                            <Button onClick={handleRedirectToRegister} style={{ borderRadius: "0", height: "40px", padding: "0 12px", fontSize: "14px", fontWeight: "700", border: "1px solid #2d2f31", color: "#fff", backgroundColor: "#2d2f31" }}>Đăng ký</Button>
                        </>
                    }

                </div>
            </div>
        </>
    )
}

export default Navbar