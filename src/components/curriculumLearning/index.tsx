import { IoIosPlayCircle } from 'react-icons/io'
import './CurriculumLearning.style.scss'
import VerifyIcon from "../../assets/verify-icon.png"
import { ILecture, IQuiz } from '../../types/CourseType'
import { useAppSelector } from '../../redux/hooks'
import { RootState } from '../../redux/store'
type PropType = {
    curriculum: ILecture | IQuiz
}
function CurriculumLearning(probs: PropType) {
    const { curriculum } = probs;
    console.log(curriculum.id);
    const type = "lecture";
    // const { curriculumId, type } = useAppSelector((state: RootState) => state.learning);
    return (
        <div className={`section-learning-curriculum-container ${curriculum.id === 3 && curriculum.type == "lecture" ? "active" : ""}`}>
            <div className="section-learning-curriculum-left">
                <h3 className="section-learning-curriculum-title">
                    {curriculum.index}. {curriculum.title}
                </h3>
                <div className="section-learning-curriculum-time">
                    <IoIosPlayCircle className='section-learning-curriculum-type' />
                    <span>4:20</span>
                </div>
            </div>
            <div className="section-learning-curriculum-right">
                <img src={VerifyIcon} alt='verify icon' className='section-learning-curriculum-status' />
            </div>
        </div>
    )
}

export default CurriculumLearning