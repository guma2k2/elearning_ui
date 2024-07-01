import { useEffect, useState } from 'react';
import './Courses.style.scss'
import { CourseType } from '../../types/CourseType';
import { getCourseWithPagination } from '../../services/CourseService';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from '../../components/banner';
import Card from '../../components/card';
function Courses() {
    const pageSize = 10;
    const [courses, setCourses] = useState<CourseType[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getCourseWithPagination(0, pageSize);
            if (res && res.status === 200) {
                console.log(res);
                const data = res.data.content as CourseType[]
                console.log(data);
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
            <Banner />
            <div className='courses-container'>
                <div className="wrapper">
                    <h2 className="header">Popular for Java Developers</h2>
                    <Slider
                        className='slider'
                        {...settings}
                    >
                        {courses && courses.map((course, index) => {
                            console.log(course);
                            return <Card key={index} course={course} />
                        })}
                    </Slider>
                </div>

            </div>
        </>

    )
}

export default Courses