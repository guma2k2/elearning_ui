import { useEffect, useState } from 'react';
import './Courses.style.scss'
import { CourseType } from '../../types/CourseType';
import { getCourseWithPagination } from '../../services/CourseService';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from '../../components/banner';
import Card from '../../components/card';
import { Tooltip, TooltipRefProps } from 'react-tooltip'
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

function Courses() {
    const pageSize = 10;
    const [courses, setCourses] = useState<CourseType[]>([]);
    const { categoryParents } = useAppSelector((state: RootState) => state.categories);

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getCourseWithPagination(0, pageSize);
            if (res && res.status === 200) {
                const data = res.data.content as CourseType[]
                setCourses(data);
            }
        }
        fetchCourses()
    }, [])
    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 4,
    };
    return (
        <>
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
            <Banner />
            <div className='courses-container'>
                <div className="wrapper">
                    <h2 className="header">Popular for Java Developers</h2>
                    <Slider
                        className='slider'
                        {...settings}
                    >
                        {courses && courses.map((course, index) => {
                            return <Card key={index} course={course} />
                        })}
                    </Slider>
                </div>
            </div>
        </>

    )
}

export default Courses