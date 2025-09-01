import { Fragment, useEffect, useState } from "react";
import "./Courses.style.scss";
import { CourseListGetType, CourseType } from "../../types/CourseType";
import { getCourseByCategory } from "../../services/CourseService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from "../../components/banner";
import Card from "../../components/card";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { getBestSellerCourse } from "../../services/OrderService";
import CourseSlider from "../../components/CourseSlider";

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseListGetType[]>([]);
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
        const fetchBestSellerCourses = async () => {
            const res = await getBestSellerCourse();
            console.log(res);
            if (res && res.status === 200) {
                const data = res.data as CourseListGetType[];
                setBestSellerCoures(data);
            }
        };
        fetchCourses();
        fetchBestSellerCourses();
    }, []);

    return (
        <div className="container">
            <h2 style={{ marginBottom: 12 }}>Gợi ý hôm nay</h2>
            <CourseSlider
                courses={courses}
                perView={5} // cố định (desktop-first)
                gap={10}
                duration={300}
                step={1} // muốn nhảy theo “trang”: set = perView
            />
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
