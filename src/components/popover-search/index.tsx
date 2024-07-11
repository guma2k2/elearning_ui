import { IoIosSearch } from "react-icons/io";
function PopoverSearch() {
    return <div className="popover-search-container">
        <div className="popover-search-course-titles">
            <div className="popover-search-course-title">
                <div className="popover-search-course-title-left">
                    <IoIosSearch className="popover-icon-search" />
                </div>
                <span className="popover-search-course-title-right">
                    Node Js
                </span>
            </div>
            <div className="popover-search-course-title">
                <div className="popover-search-course-title-left">
                    <IoIosSearch className="popover-icon-search" />
                </div>
                <span className="popover-search-course-title-right">
                    Node Js
                </span>
            </div>
            <div className="popover-search-course-title">
                <div className="popover-search-course-title-left">
                    <IoIosSearch className="popover-icon-search" />
                </div>
                <span className="popover-search-course-title-right">
                    Node Js
                </span>
            </div>
        </div>
        <div className="popover-search-course-wrapper">
            <div className="popover-search-course">
                <div className="popover-search-course-left">
                    <img src="https://img-c.udemycdn.com/course/50x50/5335230_8e2f_2.jpg" alt="course-image" />
                </div>
                <div className="popover-search-course-right">
                    <div className="popover-search-course-title">Advanced react js programming with React Hooks and Bootstrap</div>
                    <div className="popover-search-course-intructor">
                        <span className="popover-search-course-type">Course</span>
                        <span className="popover-search-course-intructor">
                            Man Nguyen
                        </span>
                    </div>
                </div>
            </div>
            <div className="popover-search-course">
                <div className="popover-search-course-left">
                    <img src="https://img-c.udemycdn.com/course/50x50/5335230_8e2f_2.jpg" alt="course-image" />
                </div>
                <div className="popover-search-course-right">
                    <div className="popover-search-course-title">Advanced react js programming with React Hooks and Bootstrap</div>
                    <div className="popover-search-course-intructor">
                        <span className="popover-search-course-type">Course</span>
                        <span className="popover-search-course-intructor">
                            Man Nguyen
                        </span>
                    </div>
                </div>

            </div>
        </div>
    </div>
}

export default PopoverSearch;