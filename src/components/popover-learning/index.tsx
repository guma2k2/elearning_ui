import { Button, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";

function PopoverLearning() {

    const { learningCourses } = useAppSelector((state: RootState) => state.learningCourses);
    const navigate = useNavigate();
    const navigateToMyLearning = () => {
        navigate("/my-learning")
    }
    const handleRedirectToCourseLearning = (slug: string) => {
        let url = `/course/${slug}/learning`
        navigate(url);
    }
    return <div className="popover-learning-container">
        <div className="popover-learning-header">
            <h3 className="popover-mylearning">Khóa học của tôi</h3>
            <Button className="popover-learning-btn-viewall" onClick={navigateToMyLearning}>Xem tất cả</Button>
        </div>
        <div className="popover-learning-courses-wrapper">
            {learningCourses && learningCourses.map((item) => {
                return <div className="popover-learning-course" key={`learning-course-popover-${item.id}`} onClick={() => handleRedirectToCourseLearning(item.course.slug)}>
                    <div className="popover-learning-course-left">
                        <img src={item.course.image} alt="course-image" />
                    </div>
                    <div className="popover-learning-course-right">
                        <div className="popover-learning-course-title">{item.course.title}</div>
                        {/* <div className="popover-learning-course-time">Học cách đây 7 ngày trước</div> */}
                        <Progress percent={item.percentFinished} showInfo={false} className="popover-learning-course-progress" />
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default PopoverLearning;