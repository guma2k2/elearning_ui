import MyLearningCourse from '../../components/my-learning-course';
import './MyLearning.style.scss'
function MyLearning() {
    return <div className="my-learning-container">
        <h2 className="my-learning-header">Học tập</h2>
        <div className="my-learning-wrapper">
            <MyLearningCourse />
            <MyLearningCourse />
            <MyLearningCourse />
            <MyLearningCourse />
            <MyLearningCourse />
        </div>
    </div>
}

export default MyLearning;