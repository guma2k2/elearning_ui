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
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
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
import { getCourseByMultiQuery, getSuggestions } from "../../services/CourseService";
import { getTopicsByCategoryId } from "../../services/TopicService";
import { TopicType } from "../../pages/admin/topic/TopicType";
import Logo from "../logo";
import { GrLanguage } from "react-icons/gr";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";
import { LangCode } from "../../types/LanguageType";
import PopoverLanguage from "../popover-language";
function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);
    const { carts } = useAppSelector((state: RootState) => state.carts);
    const cartTotal = carts ? carts.length : 0;
    const [toggleNavbar, setToggleNavbar] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const [openLearning, setOpenLearning] = useState<boolean>(false);
    const [openLanguage, setOpenLanguage] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>();

    const [keyword, setKeyword] = useState<string>("");
    const [deferredKeyword, setDeferredKeyword] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [activeParentId, setActiveParentId] = useState<number | null>(null);
    const [activeChildId, setActiveChildId] = useState<number | null>(null);
    const [lang, setLang] = useState<LangCode>("vi");

    const handleChangeLang = (code: LangCode) => {
        setLang(code);
        setOpenLanguage(false);
    };

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

    const isOpen = openSearch && keyword.trim() !== "";

    const handleChangeKeyword = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyword = e.target.value;
        console.log(newKeyword);
        setKeyword(newKeyword);
        startTransition(() => {
            setDeferredKeyword(newKeyword);
            setOpenSearch(true);
        });
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

    const handleShowFilter = () => {
        setOpenFilter((prev) => !prev);
    };

    const handleHideCart = () => {
        setOpen(false);
    };

    const getCartTotal = (): string => {
        if (cartTotal > 9) {
            return 9 + "+";
        }
        return cartTotal + "";
    };

    const getTopicsByCategory = async (catId: number) => {
        const res = await getTopicsByCategoryId(catId);
        if (res.status == 200) {
            const topics = res.data as TopicType[];
            setTopics(topics);
        } else {
            setTopics([]);
        }
    };

    const handleToggleNav = () => {
        setToggleNavbar((prev) => !prev);
        setActiveParentId(null);
        setActiveChildId(null);
    };

    useEffect(() => {
        dispatch(fetchCategoryParents());
        if (auth) {
            dispatch(getCartsByUser());
            dispatch(getLearningCourse());
        }
    }, [auth]);

    const getSuggestionsByKeyword = async () => {
        const res = await getSuggestions(deferredKeyword);
        if (res.status === 200) {
            const data = res.data as string[];
            setSuggestions(data);
        }
    };
    useEffect(() => {
        getSuggestionsByKeyword();
    }, [deferredKeyword]);

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
                                            {categoryParents &&
                                                categoryParents.map((parent) => {
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
                                                                                    className={clsx(
                                                                                        "header-category__submenu-item",
                                                                                        {
                                                                                            "is-open": activeChildId === cat.id, // mở panel con cho parent này
                                                                                        }
                                                                                    )}
                                                                                    key={`cat-${cat.id}`}
                                                                                    onMouseEnter={() =>
                                                                                        getTopicsByCategory(cat.id)
                                                                                    }
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
                                                                                            {topics.length > 0
                                                                                                ? topics.map((topic) => {
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
                                                                                                                      {topic.name}
                                                                                                                  </span>
                                                                                                              </a>
                                                                                                          </li>
                                                                                                      );
                                                                                                  })
                                                                                                : ""}
                                                                                        </ul>
                                                                                    </div>
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
                    <div className={clsx("header-form__wrapper", { show: openFilter })}>
                        <Popover
                            placement="bottom"
                            content={() => <PopoverSearch suggestions={suggestions} deferredKeyword={deferredKeyword} />}
                            rootClassName={clsx("popover-search", { "popover-search--full": openFilter })}
                            open={isOpen}
                            trigger="click"
                            arrow={openFilter ? false : true}
                            onOpenChange={setOpenSearch}
                        >
                            <div className="header-form">
                                <div className="header-form__btn">
                                    <CiSearch className="header-form__icon icon" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for anything"
                                    className="header-form__input"
                                    onChange={handleChangeKeyword}
                                />
                                <Button variant="text" className="header-form__cancel" onClick={handleShowFilter}>
                                    Cancel
                                </Button>
                            </div>
                        </Popover>
                    </div>
                    <div className="header-action">
                        <Button variant="text" className="d-none d-sm-flex header-action__search-btn" onClick={handleShowFilter}>
                            <CiSearch className="header-action__search-icon icon" />
                        </Button>
                        {isLoggin ? (
                            <>
                                <Popover
                                    placement="bottomRight"
                                    content={() => <PopoverLearning />}
                                    rootClassName="popover-learnings"
                                    trigger="click"
                                    open={openLearning}
                                    onOpenChange={handleOpenLearning}
                                >
                                    <Button variant="text" className="d-lg-none">
                                        My Learning
                                    </Button>
                                </Popover>

                                <Popover
                                    placement="bottomRight"
                                    content={() => <PopoverCart setOpen={setOpen} />}
                                    rootClassName="popover-carts"
                                    trigger="click"
                                    open={open}
                                    onOpenChange={handleOpenChange}
                                >
                                    <Button variant="text" className="d-md-none">
                                        <FiShoppingCart className="header-action__icon icon" />
                                    </Button>
                                </Popover>

                                <Popover
                                    content={PopoverUserProfile}
                                    rootClassName="popover-profiles"
                                    trigger="click"
                                    open={openProfile}
                                    placement="bottomLeft"
                                    onOpenChange={handleOpenProfileChange}
                                >
                                    <div className="header-avatar">
                                        <img
                                            src={auth?.user.photoURL ? auth?.user.photoURL : fakeAvatar}
                                            alt=""
                                            className="header-avatar__img"
                                        />
                                    </div>
                                </Popover>
                            </>
                        ) : (
                            <>
                                <Link to={"/sign-up"} className="d-md-none">
                                    <Button variant="text">Sign up</Button>
                                </Link>
                                <Link to={"/login"} className="header-action d-md-none">
                                    <Button variant="primary" className="header-action__login">
                                        Log In
                                    </Button>
                                </Link>

                                <Popover
                                    open={openLanguage}
                                    onOpenChange={setOpenLanguage}
                                    placement="bottomRight"
                                    trigger="click"
                                    overlayClassName="popover-language"
                                    content={<PopoverLanguage currentLang={lang} onChangeLang={handleChangeLang} />}
                                >
                                    <Button className="header-language__btn d-lg-none" aria-label="Change language">
                                        <GrLanguage className="header-language__icon" />
                                    </Button>
                                </Popover>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

// <div className="navbar-top-container" >

//                         <div className="search" >
//                             <div className="button"><MdSearch className="icon" /></div>
//                             <input onKeyDown={handleKeyPress} type="text" placeholder="Tìm kiếm khóa học" value={keyword} onChange={handleChangeKeyword} />
//                         </div>
//                     </Popover>
//                 </div>
//                 <div className="right">
//                     {isLoggin == true && <>

//                     </>}

//                     <div className="cart" >

{
    /* {cartTotal > 0 && <span className="cart-number">{getCartTotal()}</span>}</>} */
}

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
