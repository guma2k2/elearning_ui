import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";
import Button from "../button";

function PopoverLearning() {
    const { learningCourses } = useAppSelector((state: RootState) => state.learningCourses);
    const navigate = useNavigate();
    const navigateToMyLearning = () => {
        navigate("/my-learning");
    };
    const handleRedirectToCourseLearning = (slug: string) => {
        let url = `/course/${slug}/learning`;
        navigate(url);
    };
    return (
        <div className="popover-learning-container">
            <div className="popover-learning-header">
                <h3 className="popover-mylearning">My Learnings</h3>
                <Button variant="text" className="popover-learning-btn-viewall" onClick={navigateToMyLearning}>
                    {" "}
                    View All
                </Button>
            </div>
            <div className="popover-learning-courses-wrapper">
                {learningCourses &&
                    learningCourses.map((item) => {
                        return (
                            <div
                                className="popover-learning-course"
                                key={`learning-course-popover-${item.id}`}
                                onClick={() => handleRedirectToCourseLearning(item.course.slug)}
                            >
                                <div className="popover-learning-course-left">
                                    <img src={item.course.image} alt="course-image" />
                                </div>
                                <div className="popover-learning-course-right">
                                    <div className="popover-learning-course-title">{item.course.title}</div>
                                    <div className="popover-learning-course-time">Studied 7 days ago</div>
                                    <Progress
                                        percent={item.percentFinished}
                                        showInfo={false}
                                        className="popover-learning-course-progress"
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default PopoverLearning;
