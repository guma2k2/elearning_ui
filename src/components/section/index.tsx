import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai"
import './Section.style.scss'
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { useRef, useState } from "react"
import 'react-quill/dist/quill.snow.css';
import Curriculum from "../curriculum"
import SectionForm from "../sectionForm"
import CurriculumForm from "../curriculumForm"
import { SectionType } from "../../types/CourseType"

type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}

type Probs = {
    section: SectionType
    index: number
    prevNum: number
    nextNum: number
}

function Section(props: Probs) {
    const [toggle, setToggle] = useState<ToggleType>({ type: "button" });
    const headerRef = useRef<HTMLDivElement | null>(null);
    const { index, nextNum, prevNum, section } = props;

    const handleMouseEnter = () => {
        if (headerRef.current) {
            headerRef.current.style.display = "block";
        }
    }

    const handlMouseLeave = () => {
        if (headerRef.current) {
            headerRef.current.style.display = "none";
        }
    }
    const getLastNumberOfCurriculumList = (): number => {
        const lengthOfCurriculumList = section.curriculums.length;
        if (section.curriculums[lengthOfCurriculumList - 1]) {
            return section.curriculums[lengthOfCurriculumList - 1].number + 1;
        }
        return -1;
    }
    return (
        <>
            {toggle.type !== "addSection" && <div className="section-insert">
                <button className="section-btn-insert" onClick={() => setToggle({ type: "addSection" })}>
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>
            }
            {toggle.type === "addSection" &&
                <div className="section-add-form">
                    <SectionForm
                        prevNum={prevNum}
                        nextNum={nextNum}
                        label='New Section'
                        setToggle={setToggle}
                        toggle={toggle} />
                </div>
            }
            <div className="section-container">
                <div className="section-header"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handlMouseLeave}>
                    {toggle.type !== "updateSection" &&
                        <>
                            <div className="title">
                                <span>Section {index + 1}:</span>
                                <AiOutlineFile className="icon-file" />
                                <span>{section.title}</span>
                            </div>
                            <div className="section-action" ref={headerRef}>
                                <div className="section-action-wrapper">
                                    <MdModeEdit className="icon-edit"
                                        onClick={() => setToggle({ type: "updateSection" })} />
                                    <FaTrash className="icon-trash" />
                                </div>
                            </div>
                        </>
                    }
                    {toggle.type === "updateSection" && <div className="section-header-form">
                        <SectionForm
                            section={section}
                            prevNum={section.number}
                            nextNum={section.number}
                            label={`Section ${index + 1}:`}
                            setToggle={setToggle}
                            toggle={toggle} />
                    </div>}
                </div>
                {section.curriculums && section.curriculums.map((curriculum, index) => {
                    let prevNum: number = 0;
                    let nextNum: number = 0;
                    if (section.curriculums) {
                        if (index == 0) {
                            prevNum = nextNum = section.curriculums[0].number - 1;
                        } else {
                            prevNum = section.curriculums[index - 1].number;
                            nextNum = section.number
                        }
                    }
                    return <Curriculum
                        curriculum={curriculum}
                        key={index}
                        sectionId={section.id ? section.id : 0}
                        prevNum={prevNum}
                        nextNum={nextNum} />
                })}

                <CurriculumForm
                    prevNum={getLastNumberOfCurriculumList()}
                    nextNum={getLastNumberOfCurriculumList()}
                    sectionId={section.id ? section.id : 0}
                    toggle={toggle}
                    setToggle={setToggle}
                    type="button" />
            </div>
        </>
    )
}

export default Section