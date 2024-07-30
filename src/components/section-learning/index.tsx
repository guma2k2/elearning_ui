import { RxCaretDown, RxCaretUp } from 'react-icons/rx'
import './SectionLearning.style.scss'
import { useEffect, useState } from 'react'
import CurriculumLearning from '../curriculumLearning';
import { SectionType } from '../../types/CourseType';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
type PropType = {
    section: SectionType
    index: number,
    watchingSecond: number
}
function SectionLearning(probs: PropType) {
    const { section, index, watchingSecond } = probs
    const { learning } = useAppSelector((state: RootState) => state.learning);

    const selectionId = learning ? learning.sectionId : -1;
    const [toggle, setToggle] = useState<boolean>(section.id == selectionId);
    const handleToggle = () => {
        setToggle((prev) => !prev);
    }
    const getTotalDurationOfSection = (): string => {
        if (section) {
            let totalDurationNum: number = 0;
            section.curriculums.forEach((cur) => {
                if (cur.type == "lecture") {
                    if (cur.duration) {
                        totalDurationNum += cur.duration;
                    }
                }
            })
            const hours = Math.floor(totalDurationNum / 3600);
            const minutes = Math.floor((totalDurationNum % 3600) / 60);
            const seconds = totalDurationNum % 60;

            // Pad the hours, minutes, and seconds with leading zeros if needed
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }
        return ""
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
    useEffect(() => {
        const selectionId = learning ? learning.sectionId : -1;
        setToggle(section.id == selectionId)
    }, [learning])
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
                    <span>{getTotalDurationOfSection()}</span>
                </div>
            </div>
            {toggle === true && <div className="section-learning-curriculum-wrapper">
                {section.curriculums.length > 0 && section.curriculums.map((cur) => {
                    return <CurriculumLearning
                        watchingSecond={watchingSecond}
                        sectionId={section.id}
                        curriculum={cur}
                        key={`cur-learning-${cur.type}-${cur.id}`} />
                })}
            </div>}
        </div>
    )
}

export default SectionLearning