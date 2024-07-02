import { FaPlus } from 'react-icons/fa'
import { SectionType } from '../../types/CourseType'
import './Section.style.scss'

type ProbTypes = {
    section: SectionType,
    index: number
}
function SectionForStudent(probs: ProbTypes) {
    const { section, index } = probs;
    const countLesson = section.curriculums.length;
    return (
        <div className='section-student-container'>
            <div className="left">
                <FaPlus />
                <div className="section-title">
                    {index}. {section.title}
                </div>
            </div>
            <div className="right">{countLesson} bài học</div>
        </div>
    )
}

export default SectionForStudent