import { useEffect, useRef, useState } from 'react';
import Arrow from '../../components/arrow/Arrow';
import './Courses.style.scss'
import { CourseType } from '../../types/CourseType';
import { getCourseWithPagination } from '../../services/CourseService';
import Slider from 'react-slick';
import Cart from '../../components/cart/Cart';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Courses() {
    const pageSize = 5;
    const [courses, setCourses] = useState<CourseType[]>([]);
    const sliderRef = useRef<Slider>(null);

    const [page, setPage] = useState<number>(1);
    const handleSlideToShow = (type: string) => {
        console.log(type);
        alert(type)
        if (type == "prev" && page > 1) {
            sliderRef.current?.slickPrev();
            setPage((prev) => prev - 1);
        } else if (type = "next") {
            sliderRef.current?.slickNext();
            setPage((prev) => prev + 1);
        }
    }
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getCourseWithPagination(page - 1, pageSize);
            if (res && res.status === 200) {
                console.log(res);
                const data = res.data.content as CourseType[]
                console.log(data);
                if (courses.length == 0) {
                    setCourses(data);
                } else {
                    setCourses(prev => [...prev, ...data]);
                }
                // setPageSize(res.data.pageSize)
                // setTotalElements(res.data.totalElements)
            }
        }
        fetchCourses()
    }, [page])
    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 4,
    };
    return (
        <div className='courses-container'>
            <div className="wrapper">
                <h2 className="header">Popular for Java Developers</h2>
                <Slider
                    ref={sliderRef}
                    className='slider'
                    {...settings}
                >
                    {courses && courses.map((course, index) => {
                        console.log(course);
                        return <Cart key={index} course={course} />
                    })}

                </Slider>
                <Arrow type={"prev"} handleSlideToShow={handleSlideToShow} />
                <Arrow type={"next"} handleSlideToShow={handleSlideToShow} />
            </div>
        </div>
    )
}

export default Courses