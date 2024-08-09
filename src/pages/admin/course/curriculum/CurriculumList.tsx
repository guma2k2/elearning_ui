import { Button } from 'antd'
import './CurriculumList.style.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import Section from '../../../../components/section'
import { useState } from 'react';
import SectionForm from '../../../../components/sectionForm';
import { CourseType } from '../../../../types/CourseType';
type Probs = {
    course: CourseType | undefined
}
function CurriculumList(probs: Probs) {
    const [toggle, setToggle] = useState<boolean>(false);
    const { course } = probs;
    const sections = course?.sections;

    var prevNumber: number = 0;
    var nextNumber: number = 0;
    if (sections) {
        if (sections.length > 0) {
            prevNumber = sections[sections?.length - 1].number + 1;
            nextNumber = sections[sections?.length - 1].number + 1
        } else {
            prevNumber = 0;
            nextNumber = 0;
        }
    }

    return (
        <div className="curriculumlist-container">
            <div className="header">
                <h2>Chương trình giảng dạy</h2>
            </div>
            <div className="wrapper">
                {sections && probs.course?.sections.map((section, index) => {
                    let prevNum: number = 0;
                    let nextNum: number = 0;
                    const sections = probs.course?.sections;
                    if (sections) {
                        if (index == 0) {
                            prevNum = nextNum = section.number - 1;
                        } else {
                            prevNum = sections[index - 1].number;
                            nextNum = section.number
                        }
                    }
                    return <Section section={section} key={index} index={index} prevNum={prevNum} nextNum={nextNum} />
                })}
            </div>
            {toggle == false && <div className='plus' onClick={() => setToggle(true)}>
                <Button className='btn-plus' icon={<AiOutlinePlus />}>Section</Button>
            </div>}
            {toggle == true && <div className="curriculumlist-add-section">
                <SectionForm prevNum={prevNumber} nextNum={nextNumber} label='New Section' toggle={{ type: "" }} setToggleCurriculumList={setToggle} />
            </div>}


        </div>
    )
}

export default CurriculumList
