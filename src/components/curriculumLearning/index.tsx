import { IoIosPlayCircle } from 'react-icons/io'
import './CurriculumLearning.style.scss'
import { ILecture, IQuiz } from '../../types/CourseType'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { RootState } from '../../redux/store'
import { Checkbox, CheckboxProps } from 'antd'
import { LearningLecturePost } from '../../types/learning/LearningLectureType'
import { createLearningLecture } from '../../services/LearningLectureService'
import { LearningQuizPost } from '../../types/learning/LearningQuizType'
import { createLearningQuiz } from '../../services/LearningQuizService'
import { LearningStatus, updateStatusOfCurriculum } from '../../redux/slices/LearningSlice'
type PropType = {
    curriculum: ILecture | IQuiz,
    sectionId: number
}
function CurriculumLearning(probs: PropType) {
    const { curriculum, sectionId } = probs;
    const dispatch = useAppDispatch();
    const { learning } = useAppSelector((state: RootState) => state.learning);
    const onChange: CheckboxProps['onChange'] = async (e) => {
        const type = curriculum.type;
        const status = e.target.checked
        if (type == "lecture") {
            const learningLecturePost: LearningLecturePost = {
                lectureId: curriculum.id,
                watchingSecond: curriculum.watchingSecond,
                finished: status
            }
            const res = await createLearningLecture(learningLecturePost);
            if (res.status == 204) {
                const learningStatus: LearningStatus = {
                    sectionId: sectionId,
                    curriculum
                }
                dispatch(updateStatusOfCurriculum(learningStatus))
            }
        } else {
            const learningQuizPost: LearningQuizPost = {
                quizId: curriculum.id,
                finished: status
            }
            const res = await createLearningQuiz(learningQuizPost);
            if (res.status == 204) {
                const learningStatus: LearningStatus = {
                    sectionId: sectionId,
                    curriculum
                }
                dispatch(updateStatusOfCurriculum(learningStatus))
            }
        }
    };

    // console.log(curriculum.id);
    const type = learning ? learning.type : "";
    const curriculumId = learning ? learning.curriculumId : -1;
    // const { curriculumId, type } = useAppSelector((state: RootState) => state.learning);
    return (
        <div className={`section-learning-curriculum-container ${curriculum.id === curriculumId && curriculum.type == type ? "active" : ""}`}>
            <div className="section-learning-curriculum-left">
                <h3 className="section-learning-curriculum-title">
                    {curriculum.index}. {curriculum.title}
                </h3>
                <div className="section-learning-curriculum-time">
                    <IoIosPlayCircle className='section-learning-curriculum-type' />
                    <span>{curriculum.type == "lecture" ? curriculum.formattedDuration : ""}</span>
                </div>
            </div>
            <div className="section-learning-curriculum-right">
                <Checkbox checked={curriculum.finished} onChange={onChange} className='section-learning-curriculum-status'></Checkbox>
            </div>
        </div>
    )
}

export default CurriculumLearning