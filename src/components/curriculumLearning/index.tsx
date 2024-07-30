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
import { LearningSelection, LearningStatus, LearningWatchingSecond, updateSelection, updateStatusOfCurriculum, updateWatchingSecond } from '../../redux/slices/LearningSlice'
type PropType = {
    curriculum: ILecture | IQuiz,
    sectionId: number,
    watchingSecond: number
}
function CurriculumLearning(probs: PropType) {
    const { curriculum, sectionId, watchingSecond } = probs;
    const dispatch = useAppDispatch();
    const { learning } = useAppSelector((state: RootState) => state.learning);
    const type = learning ? learning.type : "";
    const curriculumId = learning ? learning.curriculumId : -1;
    // const { curriculumId, type } = useAppSelector((state: RootState) => state.learning);
    const handleUpdateSelection = async () => {
        if (curriculum) {
            const selection: LearningSelection = {
                sectionId,
                curriculumId: curriculum.id,
                type: curriculum.type,
            }
            dispatch(updateSelection(selection))

            if (curriculum.type == "lecture") {
                console.log(watchingSecond);
                const learningLecturePost: LearningLecturePost = {
                    lectureId: curriculum.id,
                    watchingSecond: curriculum.watchingSecond,
                    finished: curriculum.finished
                }
                const res = await createLearningLecture(learningLecturePost);
                if (res.status == 204) {
                    console.log("updated");

                    if (learning) {
                        const learningWatching: LearningWatchingSecond = {
                            sectionId: learning.sectionId,
                            curriculumId: learning.curriculumId,
                            watchingSecond: watchingSecond
                        }
                        dispatch(updateWatchingSecond(learningWatching));
                    }
                }
            } else {
                const learningQuizPost: LearningQuizPost = {
                    quizId: curriculum.id,
                    finished: curriculum.finished
                }
                const res = await createLearningQuiz(learningQuizPost);
                if (res.status == 204) {
                    console.log("updated");
                }
            }

        }
    }
    const onChange: CheckboxProps['onChange'] = async (e) => {
        e.stopPropagation();
        const type = curriculum.type;
        const status = e.target.checked
        console.log(status);

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
                    curriculum: { ...curriculum, finished: status },

                }
                console.log("update");
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
                    curriculum: { ...curriculum, finished: status },
                }
                dispatch(updateStatusOfCurriculum(learningStatus))
            }
        }
    };

    // console.log(curriculum.id);

    return (
        <div className={`section-learning-curriculum-container ${curriculum.id === curriculumId && curriculum.type == type ? "active" : ""}`}
            onClick={(e) => {
                // Check if the target is not the checkbox
                const targetElement = e.target as Element;
                if (!targetElement.closest('.section-learning-curriculum-status')) {
                    handleUpdateSelection();
                }
            }}>
            <div className="section-learning-curriculum-left">
                <h3 className="section-learning-curriculum-title">
                    {curriculum.index}. {curriculum.title}
                </h3>
                <div className="section-learning-curriculum-time">
                    <IoIosPlayCircle className='section-learning-curriculum-type' />
                    <span>{curriculum.type == "lecture" ? curriculum.formattedDuration : "00:30"}</span>
                </div>
            </div>
            <div className="section-learning-curriculum-right">
                <Checkbox checked={curriculum.finished} onChange={onChange} className='section-learning-curriculum-status'></Checkbox>
            </div>
        </div>
    )
}

export default CurriculumLearning