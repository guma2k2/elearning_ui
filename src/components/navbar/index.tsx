import { Link } from "react-router-dom"
import Logo from "../../assets/logo-udemy.svg"
import { BsCart, BsHeart } from "react-icons/bs"
import { MdOutlineKeyboardArrowRight, MdOutlineNotifications, MdSearch } from "react-icons/md"
import './Navbar.style.scss'
import { useEffect, useRef, useState } from "react"
import PopperWrapper from "../popper/PopperWrapper"
import { Tooltip, TooltipRefProps } from 'react-tooltip'
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"
import { fetchCategoryParents } from "../../redux/slices/CategorySlice"

function Navbar() {
    const dispatch = useAppDispatch();
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);
    const [results, setResults] = useState<string[]>([])
    const [cartTotal, setCartTotal] = useState<number>(11);
    const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
    const searchTooltipRef = useRef<TooltipRefProps>(null)
    const topicTooltipRef = useRef<TooltipRefProps>(null)
    const childCategoryTooltipRef = useRef<TooltipRefProps>(null)
    const categoryRef = useRef<HTMLDivElement>(null)
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

                    >Categories</div>
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
                        <input type="text" placeholder="Search for anything" />
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
                    <div className="learnings">My learning</div>
                    <BsHeart className="icon" />
                    <div className="cart">
                        <BsCart className="icon-cart"></BsCart>
                        {cartTotal > 0 && <span className="cart-number">{getCartTotal()}</span>}
                    </div>
                    <div className="notification"><MdOutlineNotifications className="icon" /></div>
                    <div className="profile"></div>
                </div>
            </div>
            <div className="navbar-bottom-container">
                {categoryParents?.map((item, index) => {
                    return <div key={item.id}
                        className="navbar-bottom-item"
                        data-tooltip-id="tooltip-navbar-bottom"
                        data-tooltip-content={index.toString()}
                    >
                        <span>{item.name}</span>
                    </div>
                })}
                <Tooltip
                    className="subnav-tooltip"
                    id="tooltip-navbar-bottom"
                    place="bottom"
                    offset={5}
                    clickable
                    render={({ content }) => {
                        if (content) {
                            const index: number = content ? parseInt(content) : -1;
                            const childrens: CategoryType[] = categoryParents ? categoryParents[index].childrens : [];
                            const html = childrens.length > 0 && childrens.map((child) => {
                                return <div key={child.id} className="navbar-bottom-item"><span>{child.name}</span></div>
                            })
                            return <div className="wrapper" >{html}</div>;
                        }
                    }
                    }
                />
            </div>
        </>
    )
}

export default Navbar