import { RxCaretDown, RxCaretUp } from 'react-icons/rx'
import './SectionLearning.style.scss'
import { useState } from 'react'
import CurriculumLearning from '../curriculumLearning';
import { SectionType } from '../../types/CourseType';
type PropType = {
    section: SectionType
    index: number
}
function SectionLearning(probs: PropType) {
    const { section, index } = probs
    const [toggle, setToggle] = useState<boolean>(false);
    const handleToggle = () => {
        setToggle((prev) => !prev);
    }
    return (
        <div className="section-learning-container">
            <div className="section-learning-wrapper" onClick={handleToggle}>
                <div className="section-learning-top">
                    <div className="section-learning-top-left">
                        {index + 1}. {section.title}
                    </div>
                    <div className="section-learning-top-right">
                        {toggle === true ? <RxCaretDown className='section-learning-toggle' /> : <RxCaretUp className='section-learning-toggle' />}
                    </div>
                </div>
                <div className="section-learning-bottom">
                    <span>0/2</span>
                    <span>|</span>
                    <span>4:20</span>
                </div>
            </div>
            {toggle === true && <div className="section-learning-curriculum-wrapper">
                {section.curriculums.length > 0 && section.curriculums.map((cur) => {
                    return <CurriculumLearning curriculum={cur} key={`cur-learning-${cur.type}-${cur.id}`} />
                })}
            </div>}
        </div>
    )
}

export default SectionLearning