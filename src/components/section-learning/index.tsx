import { RxCaretDown, RxCaretUp } from 'react-icons/rx'
import './SectionLearning.style.scss'
import { useState } from 'react'
import CurriculumLearning from '../curriculumLearning';
import { SectionType } from '../../types/CourseType';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
type PropType = {
    section: SectionType
    index: number
}
function SectionLearning(probs: PropType) {
    const { section, index } = probs
    const { learning } = useAppSelector((state: RootState) => state.learning);

    const selectionId = learning ? learning.sectionId : -1;
    const [toggle, setToggle] = useState<boolean>(section.id == selectionId);
    const handleToggle = () => {
        setToggle((prev) => !prev);
    }
    const getCurriculumFinishedCountBySection = (): number => {
        if (learning) {
            let count: number = 0;
            learning.course.sections.forEach((sec) => {
                if (sec.id == section.id) {
                    sec.curriculums.forEach((cur) => {
                        if (cur.finished == true) {
                            count++;
                        }
                    })
                }
            })
            return count;
        }
        return 0;
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
                    <span>{getCurriculumFinishedCountBySection()}/{section?.curriculums.length}</span>
                    <span>|</span>
                    <span>4:20</span>
                </div>
            </div>
            {toggle === true && <div className="section-learning-curriculum-wrapper">
                {section.curriculums.length > 0 && section.curriculums.map((cur) => {
                    return <CurriculumLearning sectionId={section.id} curriculum={cur} key={`cur-learning-${cur.type}-${cur.id}`} />
                })}
            </div>}
        </div>
    )
}

export default SectionLearning