import { FaMinus, FaPlus } from 'react-icons/fa'
import { SectionType } from '../../types/CourseType'
import './Section.style.scss'
import { useState } from 'react'

type ProbTypes = {
    section: SectionType,
    index: number
}
function SectionForStudent(probs: ProbTypes) {
    const { section, index } = probs;
    const [toggle, setToggle] = useState<boolean>(false);
    const countLesson = section.curriculums.length;

    const handleToggle = () => {
        setToggle((prev) => !prev);
    }
    return (
        <div className="section-detail-container">
            <div className='section-student-container' onClick={handleToggle}>
                <div className="section-student-container-left">
                    {toggle == true ? <FaPlus className='icon-toggle' /> : <FaMinus className='icon-toggle' />}
                    <div className="section-title">
                        {index}. {section.title}
                    </div>
                </div>
                <div className="section-student-container-right">{countLesson} bài học</div>
            </div>
            {toggle == true && <div className="curriculum-student-container">
                {section && section.curriculums.map((cur) => {
                    return <div className='curriculum-student-item'>
                        <div className="curriculum-student-left">
                            <div className="curriculum-title">
                                {index}. {cur.title}
                            </div>
                        </div>
                        <div className="curriculum-student-right">{cur.type == "lecture" && cur.formattedDuration}</div>
                    </div>
                })}
            </div>}
        </div>
    )
}

export default SectionForStudent