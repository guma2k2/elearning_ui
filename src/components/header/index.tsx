import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdMenu,
    MdOutlineKeyboardArrowRight,
    MdOutlineNotifications,
    MdSearch,
} from "react-icons/md";
import "./Header.style.scss";
import Button from "../button";
import { CiSearch } from "react-icons/ci";
import { Fragment, useEffect, useRef, useState } from "react";
import PopperWrapper from "../popper/PopperWrapper";
import fakeAvatar from "../../assets/img/150.jpg";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchCategoryParents } from "../../redux/slices/CategorySlice";
import { Popover } from "antd";
import PopoverCart from "../popover-cart";
import PopoverUserProfile from "../popover-user-photo";
import PopoverLearning from "../popover-learning";
import PopoverSearch from "../popover-search";
import { getCartsByUser } from "../../redux/slices/CartSlice";
import { getLearningCourse } from "../../redux/slices/LearningCourseSlice";
import { CourseGetType } from "../../types/CourseType";
import { getCourseByMultiQuery } from "../../services/CourseService";
import { getTopicsByCategoryId } from "../../services/TopicService";
import { TopicType } from "../../pages/admin/topic/TopicType";
import Logo from "../logo";
import { GrLanguage } from "react-icons/gr";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";
function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);
    const [results, setResults] = useState<string[]>([]);
    const { carts } = useAppSelector((state: RootState) => state.carts);
    const cartTotal = carts ? carts.length : 0;
    const [toggleNavbar, setToggleNavbar] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const [openLearning, setOpenLearning] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [courses, setCourses] = useState<CourseGetType[]>();

    const [activeParentId, setActiveParentId] = useState<number | null>(null);

    const [activeChildId, setActiveChildId] = useState<number | null>(null);

    const handleOpenSubmenu = (parentId: number) => (e: any) => {
        e.preventDefault();
        if (toggleNavbar == true) {
            setActiveParentId(parentId);
        }
    };

    const handleOpenSubmenuTopic = (childId: number) => (e: any) => {
        e.preventDefault();
        if (toggleNavbar == true) {
            setActiveChildId(childId);
        }
    };

    const backToRoot = () => {
        setActiveParentId(null);
        if (activeChildId != null) {
            setActiveChildId(null);
        }
    };

    const backToChild = () => setActiveChildId(null);

    const handleChangeKeyword = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        setOpenSearch(true);
        if (newKeyword && newKeyword != "") {
            const params = `keyword=${newKeyword}`;
            const res = await getCourseByMultiQuery(params);
            if (res.status == 200) {
                const data = res.data as CourseGetType[];
                const result = data.length > 10 ? data.slice(0, 10) : data;
                setCourses(result);
            }
        } else {
            setCourses([]);
        }
        setKeyword(newKeyword);
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (keyword && keyword.length > 0) {
                let url = `/courses/search?keyword=${keyword}`;
                navigate(url);
                setOpenSearch(false);
            }
        }
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

    const handleOpenSearch = (newOpen: boolean) => {
        setOpenSearch(newOpen);
    };

    const handleHideCart = () => {
        setOpen(false);
    };

    const handleRedirectToLogin = () => {
        navigate("/login");
    };

    const handleRedirectToRegister = () => {
        navigate("/register");
    };
    const getCartTotal = (): string => {
        if (cartTotal > 9) {
            return 9 + "+";
        }
        return cartTotal + "";
    };

    const parents: CategoryListGetType[] = [
        {
            id: 1,
            name: "Parent 1",
            isPublish: true,
            childrens: [
                {
                    id: 2,
                    name: "Child 1",
                    isPublish: true,
                },
                {
                    id: 3,
                    name: "Child 2",
                    isPublish: true,
                },
                {
                    id: 4,
                    name: "Child 3",
                    isPublish: true,
                },
            ],
        },
        {
            id: 5,
            name: "Parent 2",
            isPublish: true,
            childrens: [],
        },
        {
            id: 6,
            name: "Parent 3",
            isPublish: true,
            childrens: [],
        },
        {
            id: 7,
            name: "Parent 4",
            isPublish: true,
            childrens: [],
        },
    ];

    const getTopicsByCategory = (_catId: number) => {
        const topics = [
            {
                id: 1,
                name: "topic 1",
                isPublish: true,
                createdAt: "",
                updatedAt: "",
            },
            {
                id: 2,
                name: "topic 1",
                isPublish: true,
                createdAt: "",
                updatedAt: "",
            },
            {
                id: 3,
                name: "topic 1",
                isPublish: true,
                createdAt: "",
                updatedAt: "",
            },
        ] as TopicType[];

        if (_catId != 2) {
            return [];
        }
        return topics;
    };

    const handleToggleNav = () => {
        setToggleNavbar((prev) => !prev);
        setActiveParentId(null);
        setActiveChildId(null);
    };
    useEffect(() => {
        if (results.length > 0) {
        }
    }, [results]);

    useEffect(() => {
        dispatch(fetchCategoryParents());
        if (auth) {
            dispatch(getCartsByUser());
            dispatch(getLearningCourse());
        }
    }, [auth]);
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <div className="header-left">
                        <div className="header-menu d-none d-lg-block">
                            <MdMenu className="header-menu__icon icon" onClick={handleToggleNav} />
                        </div>
                        <Logo />
                        <nav className={clsx("navbar", { show: toggleNavbar, drill: activeParentId !== null })}>
                            <div className="navbar__inner">
                                <Button variant="text" className="header-category d-lg-none">
                                    Explore
                                </Button>
                                <div className="dropdown">
                                    <div className="dropdown__inner">
                                        <div className="header-submenu__heading">All categories</div>
                                        <ul className="header-category__list">
                                            {parents.map((parent) => {
                                                return (
                                                    <li
                                                        className={clsx("header-category__item", {
                                                            "is-open": activeParentId === parent.id, // mở panel con cho parent này
                                                        })}
                                                        key={`parent-${parent.id}`}
                                                    >
                                                        <a
                                                            href="#!"
                                                            className="header-category__link header__link"
                                                            onClick={handleOpenSubmenu(parent.id)}
                                                        >
                                                            <span className="header__link-text">{parent.name}</span>
                                                            <MdKeyboardArrowRight className="icon" />
                                                        </a>
                                                        {parent.childrens && parent.childrens.length > 0 && (
                                                            <div className="header-category__submenu">
                                                                <div
                                                                    className="header__submenu-top d-none d-lg-flex"
                                                                    onClick={backToRoot}
                                                                >
                                                                    <MdKeyboardArrowLeft />
                                                                    <span>Menu</span>
                                                                </div>
                                                                <ul className="header-category__submenu-list">
                                                                    {parent.childrens.map((cat) => {
                                                                        return (
                                                                            <li
                                                                                className={clsx("header-category__submenu-item", {
                                                                                    "is-open": activeChildId === cat.id, // mở panel con cho parent này
                                                                                })}
                                                                                key={`cat-${cat.id}`}
                                                                            >
                                                                                <a
                                                                                    onClick={handleOpenSubmenuTopic(cat.id)}
                                                                                    href="#!"
                                                                                    className="header-category__submenu-link header__link"
                                                                                >
                                                                                    <span className="header__link-text">
                                                                                        {cat.name}
                                                                                    </span>
                                                                                    <MdKeyboardArrowRight className="icon" />
                                                                                </a>
                                                                                {getTopicsByCategory(cat.id) &&
                                                                                    getTopicsByCategory(cat.id).length > 0 && (
                                                                                        <div className="header-topic__submenu">
                                                                                            <div
                                                                                                className="header__submenu-top d-none d-lg-flex"
                                                                                                onClick={backToRoot}
                                                                                            >
                                                                                                <MdKeyboardArrowLeft />
                                                                                                <span>All Categories</span>
                                                                                            </div>
                                                                                            <div
                                                                                                className="header__submenu-top d-none d-lg-flex"
                                                                                                onClick={backToChild}
                                                                                            >
                                                                                                <MdKeyboardArrowLeft />
                                                                                                <span>Menu</span>
                                                                                            </div>
                                                                                            <div className="header-submenu__heading">
                                                                                                Popular Topics
                                                                                            </div>
                                                                                            <ul className="header-topic__submenu-list">
                                                                                                {getTopicsByCategory(cat.id).map(
                                                                                                    (topic) => {
                                                                                                        return (
                                                                                                            <li
                                                                                                                className="header-topic__item"
                                                                                                                key={`topic-${topic.id}`}
                                                                                                            >
                                                                                                                <a
                                                                                                                    href="#!"
                                                                                                                    className="header-topic__link header__link"
                                                                                                                >
                                                                                                                    <span className="header__link-text">
                                                                                                                        {
                                                                                                                            topic.name
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </a>
                                                                                                            </li>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                            </ul>
                                                                                        </div>
                                                                                    )}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <Button variant="circle" className="navbar__dismiss" onClick={handleToggleNav}>
                            <FaTimes className="icon" />
                        </Button>
                        <div className="navbar__overlay" aria-label="Close menu" onClick={handleToggleNav}></div>
                    </div>
                    <form action="" className="header-form">
                        <div className="header-form__btn">
                            <CiSearch className="header-form__icon icon" />
                        </div>
                        <input type="text" placeholder="Search for anything" className="header-form__input" />
                    </form>
                    <div className="header-action">
                        <Button variant="text" className="d-none d-sm-flex header-action__search-btn">
                            <CiSearch className="header-action__search-icon icon" />
                        </Button>
                        <Link to={"/sign-up"} className="d-md-none">
                            <Button variant="text">Sign up</Button>
                        </Link>
                        <Link to={"/login"} className="header-action d-md-none">
                            <Button variant="primary" className="header-action__login">
                                Log In
                            </Button>
                        </Link>
                        <Button variant="outline" className="header-language__btn d-lg-none">
                            <GrLanguage className="header-language__icon" />
                        </Button>
                    </div>
                    {/* 
                    <div className="header-action">
                        <Button variant="text" className="d-none d-sm-flex header-action__search-btn">
                            <CiSearch className="header-action__search-icon icon" />
                        </Button>
                        <Link to={"/my-learning"} className="d-lg-none">
                            <Button variant="text">My Learning</Button>
                        </Link>
                        <Link to={"/cart"}>
                            <Button variant="text" className="d-md-none">
                                <FiShoppingCart className="header-action__icon" />
                            </Button>
                        </Link>

                        <Link to={"/profile"}>
                            <div className="header-avatar">
                                <img src={fakeAvatar} alt="" className="header-avatar__img" />
                            </div>
                        </Link>
                    </div> */}
                </div>
            </div>
        </header>
    );
}

export default Header;

// <div className="navbar-top-container" >
//                 <div className="left">
//                     <Link to={"/"} className="logo" >
//                         <img src={Logo} alt="Logo image" />
//                     </Link>
//                     <div className="categories"
//                         data-tooltip-id="category-tooltip"
//                         ref={categoryRef}
//                         onClick={() => setCategoryOpen(true)}

//                     >Thể loại</div>
//                     <Tooltip id="category-tooltip"
//                         place="bottom-end"
//                         className="category-tooltip"
//                         disableStyleInjection
//                         imperativeModeOnly
//                         clickable
//                         offset={18}
//                         isOpen={categoryOpen}
//                     >
//                         <PopperWrapper >
//                             {categoryParents?.map((item, index) => {
//                                 return <div key={item.id} className="category-item"
//                                     data-tooltip-id="category-child-tooltip"
//                                     onMouseEnter={() => handleShowCategoryChildTooltip(index)}
//                                 >
//                                     <span>{item.name}</span>
//                                     <MdOutlineKeyboardArrowRight />
//                                 </div>
//                             })}
//                         </PopperWrapper>
//                     </Tooltip>
//                     <Tooltip
//                         className="category-child-tooltip"
//                         id="category-child-tooltip"
//                         isOpen={categoryOpen}
//                         offset={18}
//                         imperativeModeOnly
//                         disableStyleInjection
//                         ref={childCategoryTooltipRef}
//                         clickable
//                         afterShow={() => handleShowCategoryChildTooltip(0)}
//                     />
//                     <Tooltip
//                         className="topic-tooltip"
//                         id="topic-tooltip"
//                         ref={topicTooltipRef}
//                         offset={18}
//                         imperativeModeOnly
//                         disableStyleInjection
//                         clickable
//                         afterHide={() => setCategoryOpen(false)}
//                     />

//                     <Popover
//                         placement="bottom"
//                         content={() => <PopoverSearch courses={courses} keyword={keyword} />}
//                         rootClassName="popover-search"
//                         open={openSearch}
//                         onOpenChange={handleOpenSearch}
//                     >
//                         <div className="search" >
//                             <div className="button"><MdSearch className="icon" /></div>
//                             <input onKeyDown={handleKeyPress} type="text" placeholder="Tìm kiếm khóa học" value={keyword} onChange={handleChangeKeyword} />
//                         </div>
//                     </Popover>
//                 </div>
//                 <div className="right">
//                     {isLoggin == true && <>
//                         <Popover
//                             placement="bottomRight"
//                             content={PopoverLearning}
//                             rootClassName="popover-learnings"
//                             trigger="click"
//                             open={openLearning}
//                             onOpenChange={handleOpenLearning}
//                         >
//                             <div className="learnings">Khóa học của tôi</div>
//                         </Popover>
//                     </>}

//                     <div className="cart" >
//                         {isLoggin == true && <> <Popover
//                             placement="bottomRight"
//                             content={() => <PopoverCart setOpen={setOpen} />}
//                             rootClassName="popover-carts"
//                             trigger="click"
//                             open={open}
//                             onOpenChange={handleOpenChange}
//                         >
//                             <PiShoppingCartLight className="icon-cart"></PiShoppingCartLight>
//                         </Popover>
//                             {cartTotal > 0 && <span className="cart-number">{getCartTotal()}</span>}</>}

//                     </div>

//                     {isLoggin == true && <>
//                         {/* <div className="notification"><MdOutlineNotifications className="icon" /></div> */}
//                         <Popover
//                             content={PopoverUserProfile}
//                             rootClassName="popover-profiles"
//                             trigger="click"
//                             open={openProfile}
//                             placement="bottomLeft"
//                             onOpenChange={handleOpenProfileChange}
//                         >
//                             <img src={auth?.user.photoURL ? auth?.user.photoURL : UserPhoto} alt="Photo" className="profile" />
//                         </Popover>
//                     </>
//                     }
//                     {
//                         isLoggin == false && <>
//                             <Button onClick={handleRedirectToLogin} style={{ borderRadius: "0", height: "40px", padding: "0 12px", fontSize: "14px", fontWeight: "700", border: "1px solid #2d2f31" }}>Đăng nhập</Button>
//                             <Button onClick={handleRedirectToRegister} style={{ borderRadius: "0", height: "40px", padding: "0 12px", fontSize: "14px", fontWeight: "700", border: "1px solid #2d2f31", color: "#fff", backgroundColor: "#2d2f31" }}>Đăng ký</Button>
//                         </>
//                     }

//                 </div>
//             </div>
