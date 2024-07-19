import MyLearningCourse from '../../components/my-learning-course';
import './MyLearning.style.scss'
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
function MyLearning() {
    const { learningCourses } = useAppSelector((state: RootState) => state.learningCourses);

    return <div className="my-learning-container">
        <h2 className="my-learning-header">Học tập</h2>
        <div className="my-learning-wrapper">
            {learningCourses && learningCourses.map((learingCourse) => <MyLearningCourse learingCourse={learingCourse} key={`my-learning-course-${learingCourse.id}`} />)}
        </div>
    </div>
}

export default MyLearning;