import { Divider } from "antd";
import { IoIosSearch } from "react-icons/io";
import { useState } from 'react'
import { CourseGetType } from "../../types/CourseType";
import { useNavigate } from "react-router-dom";

type PropType = {
    courses: CourseGetType[] | undefined,
    keyword: string
}
function PopoverSearch(props: PropType) {
    const { courses, keyword } = props;
    const navigate = useNavigate();
    const handleRedirectToCourseDetail = (id: number) => {
        navigate(`/courses/${id}`);
    }
    return <div className="popover-search-container">
        <div className="popover-search-header">
            <div className="popover-search-header-top">
                <IoIosSearch />
                <span>Kết quả cho '{keyword}'</span>
            </div>
            <div className="popover-search-header-bottom">
                <h5>KHÓA HỌC</h5>
                <span>Xem thêm</span>
            </div>
            <Divider className="popover-search-header-divider" />
        </div>
        <div className="popover-search-course-wrapper">
            {courses && courses.length > 0 && courses.map((course) => {
                return <div className="popover-search-course" key={`course-search-${course.id}`} onClick={() => handleRedirectToCourseDetail(course.id)}>
                    <div className="popover-search-course-left">
                        <img src={course.image} alt="course-image" />
                    </div>
                    <div className="popover-search-course-right">
                        <div className="popover-search-course-title">{course.title}</div>
                        <div className="popover-search-course-intructor">
                            <span className="popover-search-course-type">Course</span>
                            <span className="popover-search-course-intructor">
                                Man Nguyen
                            </span>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default PopoverSearch;