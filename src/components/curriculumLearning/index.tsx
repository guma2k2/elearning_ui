import { IoIosPlayCircle } from 'react-icons/io'
import './CurriculumLearning.style.scss'
import VerifyIcon from "../../assets/verify-icon.png"
import { ILecture, IQuiz } from '../../types/CourseType'
type PropType = {
    curriculum: ILecture | IQuiz
}
function CurriculumLearning(probs: PropType) {
    const { curriculum } = probs;
    return (
        <div className="section-learning-curriculum-container">
            <div className="section-learning-curriculum-left">
                <h3 className="section-learning-curriculum-title">
                    {curriculum.title}
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