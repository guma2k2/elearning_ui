import { Button, Progress } from "antd";

function PopoverLearning() {
    return <div className="popover-learning-container">
        <div className="popover-learning-header">
            <h3 className="popover-mylearning">Khóa học của tôi</h3>
            <Button className="popover-learning-btn-viewall">Xem tất cả</Button>
        </div>
        <div className="popover-learning-courses-wrapper">
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
            <div className="popover-learning-course">
                <div className="popover-learning-course-left">
                    <img src="https://files.fullstack.edu.vn/f8-prod/courses/1.png" alt="course-image" />
                </div>
                <div className="popover-learning-course-right">
                    <div className="popover-learning-course-title">Lập Trình JavaScript Cơ Bản</div>
                    <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div>
                    <Progress percent={50} showInfo={false} className="popover-learning-course-progress" />
                </div>
            </div>
        </div>
    </div>
}

export default PopoverLearning;