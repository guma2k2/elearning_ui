import { Fragment, useEffect, useState } from "react";
import styles from "./Courses.module.scss";
import { CourseListGetType, CourseType } from "../../types/CourseType";
import { getCourseByCategory } from "../../services/CourseService";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { getBestSellerCourse } from "../../services/OrderService";
import CourseSlider from "../../components/CourseSlider";
import BannerImage from "../../assets/img/banner.png";
import CircleImage from "../../assets/img/Circle.png";
import AmazonIcon from "../../assets/Amazon.svg";
import SlackIcon from "../../assets/Slack.svg";
import GoogleIcon from "../../assets/Google.svg";
import GustoIcon from "../../assets/Gusto.svg";
import HubSpotIcon from "../../assets/HubSpot.svg";
import clsx from "clsx";

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseListGetType[]>([]);
    const [recommendCourses, setRecommendCourses] = useState<CourseListGetType[]>([]);
    const [bestSellerCoures, setBestSellerCoures] = useState<CourseListGetType[]>([]);
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);
    const { learningCourses } = useAppSelector((state: RootState) => state.learningCourses);

    const handleRedirectToFilterPage = (catName: string) => {
        navigate(`/courses/search?catName=${catName}`);
    };
    useEffect(() => {
        const fetchCourses = async () => {
            let cat: string = "Yoga";
            const res = await getCourseByCategory(cat);
            console.log(res);

            if (res && res.status === 200) {
                const data = res.data as CourseListGetType[];
                setCourses(data);
            }
        };

        const fetchCourses2 = async () => {
            let cat: string = "Web Development";
            const res = await getCourseByCategory(cat);
            console.log(res);

            if (res && res.status === 200) {
                const data = res.data as CourseListGetType[];
                setRecommendCourses(data);
            }
        };
        const fetchBestSellerCourses = async () => {
            const res = await getBestSellerCourse();
            console.log(res);
            if (res && res.status === 200) {
                const data = res.data as CourseListGetType[];
                setBestSellerCoures(data);
            }
        };
        fetchCourses();
        fetchCourses2();
        fetchBestSellerCourses();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.banner}>
                <div className="container">
                    <div className={styles.banner__wrapper}>
                        <div className={styles.banner__info}>
                            <h1 className={styles.banner__heading}>We share knowledge with the world</h1>
                            <p className={styles.banner__desc}>
                                Circuit is the trusted market leader in talent transformation. We change lives, businesses, and
                                nations through digital upskilling, developing the edge you need to conquer what’s next.
                            </p>
                            <p className={styles.banner__desc_small}>
                                We envision a world where anyone, anywhere has the power to transform their life through learning.
                            </p>
                        </div>
                        <div className={styles.banner_image__wrapper}>
                            <img src={BannerImage} alt="" className={styles.banner__img} />
                            <img src={CircleImage} alt="" className={styles.banner__icon} />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className={styles.cta}>
                <div className="container">
                    <div className={styles.cta__inner}>
                        <img src={GoogleIcon} alt="" className={clsx(styles.cta__img, "icon")} />
                        <img src={SlackIcon} alt="" className={clsx(styles.cta__img, "icon")} />
                        <img src={AmazonIcon} alt="" className={clsx(styles.cta__img, "icon")} />
                        <img src={HubSpotIcon} alt="" className={clsx(styles.cta__img, "icon")} />
                        <img src={GustoIcon} alt="" className={clsx(styles.cta__img, "icon")} />
                    </div>
                </div>
            </div>

            <div className={styles.courses__item}>
                <div className="container">
                    <h2 className={styles.courses__heading}>Recommended for you</h2>
                    <CourseSlider courses={recommendCourses} perView={5} gap={10} duration={300} step={1} />
                </div>
            </div>

            <div className={styles.courses__item}>
                <div className="container">
                    <h2 className={styles.courses__heading}>New and Notable Courses in Yoga</h2>
                    <CourseSlider courses={courses} perView={5} gap={10} duration={300} step={1} />
                </div>
            </div>
        </div>
    );
}

export default Courses;

{
    /* <div className="navbar-bottom-container">
                {categoryParents?.map((item, index) => {
                    return <div key={item.id}
                        onClick={() => handleRedirectToFilterPage(item.name)}
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
                                return <div onClick={() => handleRedirectToFilterPage(child.name)} key={child.id} className="navbar-bottom-item"><span>{child.name}</span></div>
                            })
                            return <div className="wrapper" >{html}</div>;
                        }
                    }
                    }
                />
            </div>
            <Banner />
            <div className='courses-container'>
                {learningCourses && learningCourses.length > 0 && <div className="wrapper">
                    <h2 className="header">Khóa học của tôi</h2>
                    <div className="courses-learning-wrapper">
                        {learningCourses && learningCourses.map((lc, index) => {
                            if (index < 5) {
                                return <div key={`lc-${lc.id}`} className="courses-learning-item"><Card course={lc.course} /></div>
                            }
                        })}
                    </div>
                </div>}
                <div className="wrapper">
                    <h2 className="header">Khóa học lập trình web</h2>
                    <Slider
                        className='slider'
                        {...settings}
                    >
                        {courses && courses.map((course, index) => {
                            return <Card key={index} course={course} />
                        })}
                    </Slider>
                </div>
                <div className="wrapper">
                    <h2 className="header">Các khóa học bán chạy</h2>
                    <Slider
                        className='slider'
                        {...settings}
                    >
                        {bestSellerCoures && bestSellerCoures.map((course, _index) => {
                            return <Card key={`best-seller-course-${course.id}`} course={course} />
                        })}
                    </Slider>
                </div>

            </div> */
}
