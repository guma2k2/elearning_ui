import { useEffect, useState } from 'react';
import MyLearningCourse from '../../components/my-learning-course';
import './MyLearning.style.scss'
import { LearningCourse } from '../../types/learning/LearningCourseType';
import { getMyLearningByStudent } from '../../services/LearningService';
function MyLearning() {

    const [learningCourses, setLearningCourses] = useState<LearningCourse[]>()
    useEffect(() => {
        const fetchLearningCoursesByStudent = async () => {
            const res = await getMyLearningByStudent();
            console.log(res);
            if (res.status === 200) {
                const data = res.data as LearningCourse[];
                setLearningCourses(data);
            }
        }

        fetchLearningCoursesByStudent();
    }, [])
    return <div className="my-learning-container">
        <h2 className="my-learning-header">Học tập</h2>
        <div className="my-learning-wrapper">
            {learningCourses && learningCourses.map((learingCourse) => <MyLearningCourse learingCourse={learingCourse} key={`my-learning-course-${learingCourse.id}`} />)}
        </div>
    </div>
}

export default MyLearning;