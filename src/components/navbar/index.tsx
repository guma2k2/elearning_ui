import { Link } from "react-router-dom"
import Logo from "../../assets/logo-udemy.svg"
import { BsCart, BsHeart } from "react-icons/bs"
import { MdOutlineKeyboardArrowRight, MdOutlineNotifications, MdSearch } from "react-icons/md"
import './Navbar.style.scss'
import { useEffect, useRef, useState } from "react"
import PopperWrapper from "../popper/PopperWrapper"
import { Tooltip, TooltipRefProps } from 'react-tooltip'

const items: CategoryListGetType[] = [
    {
        id: 1,
        name: "Development",
        isPublish: true,
        childrens: [
            {
                id: 2,
                name: "sub cat1",
                isPublish: true
            },
            {
                id: 100,
                name: "sub cat1",
                isPublish: true
            },
            {
                id: 101,
                name: "sub cat1",
                isPublish: true
            },
            {
                id: 102,
                name: "sub cat1",
                isPublish: true
            }
        ]
    },
    {
        id: 3,
        name: "Business",
        isPublish: true,
        childrens: [
            {
                id: 4,
                name: "sub cat2",
                isPublish: true
            }
        ]
    },
    {
        id: 5,
        name: "Finance & Accounting",
        isPublish: true,
        childrens: [
            {
                id: 6,
                name: "sub cat3",
                isPublish: true
            }
        ]
    },
    {
        id: 7,
        name: "It & Software",
        isPublish: true,
        childrens: [
            {
                id: 8,
                name: "sub cat4",
                isPublish: true
            }
        ]
    },
    {
        id: 9,
        name: "Office Productivity",
        isPublish: true,
        childrens: [
            {
                id: 10,
                name: "sub cat5",
                isPublish: true
            }
        ]
    },
    {
        id: 11,
        name: "Personal Development",
        isPublish: true,
        childrens: [
            {
                id: 12,
                name: "sub cat6",
                isPublish: true
            }
        ]
    },
    {
        id: 13,
        name: "Design",
        isPublish: true,
        childrens: [
            {
                id: 14,
                name: "sub cat7",
                isPublish: true
            }
        ]
    },
    {
        id: 15,
        name: "Marketing",
        isPublish: true,
        childrens: [
            {
                id: 16,
                name: "sub cat8",
                isPublish: true
            }
        ]
    }
]
function Navbar() {
    const [results, setResults] = useState<string[]>([])
    const searchTooltipRef = useRef<TooltipRefProps>(null)
    const childCategoryTooltipRef = useRef<TooltipRefProps>(null)
    const categoryRef = useRef<HTMLDivElement>(null)
    const handleShowCategoryChildTooltip = (parentId: number) => {
        console.log(parentId);
        let xCategoryTooltipPosition: number = 0;
        if (categoryRef.current) {
            const { x } = categoryRef.current.getBoundingClientRect();
            xCategoryTooltipPosition = x * 2;
        }
        if (childCategoryTooltipRef.current) {
            const index: number = parentId;
            console.log(index);
            const childrens: CategoryType[] = items[index].childrens;
            const html = childrens.length > 0 && childrens.map((child) => {
                return <div key={child.id} className="category-item">
                    <span>{child.name}</span>
                    <MdOutlineKeyboardArrowRight />
                </div>
            })
            childCategoryTooltipRef.current.open({
                content: <PopperWrapper>{html}</PopperWrapper>,
                position: {
                    x: xCategoryTooltipPosition + 256,
                    y: 46
                },
            }
            )
        }

    }
    useEffect(() => {
        if (results.length > 0) {
            if (searchTooltipRef.current) {
                searchTooltipRef.current.open();
            }
        }
    }, [results])

    return (
        <>
            <div className="navbar-top-container" >
                <div className="left">
                    <Link to={"/"} className="logo" >
                        <img src={Logo} alt="Logo image" />
                    </Link>
                    <div className="categories" data-tooltip-id="category-tooltip" ref={categoryRef}>Categories</div>
                    <Tooltip id="category-tooltip"
                        place="bottom-end"
                        className="category-tooltip"
                        disableStyleInjection
                        clickable
                        offset={18}
                    >
                        <PopperWrapper >
                            {items.map((item, index) => {
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
                        // place="right-start"
                        offset={18}
                        imperativeModeOnly
                        disableStyleInjection
                        ref={childCategoryTooltipRef}
                        clickable

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
                    <div className="cart"><BsCart className="icon" /></div>
                    <div className="notification"><MdOutlineNotifications className="icon" /></div>
                    <div className="profile"></div>
                </div>
            </div>
            <div className="navbar-bottom-container">
                {items.map((item, index) => {
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
                            const childrens: CategoryType[] = items[index].childrens;
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