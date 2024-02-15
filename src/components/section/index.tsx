import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai"
import './Section.style.scss'
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { useRef, useState } from "react"
import 'react-quill/dist/quill.snow.css';
import Curriculum from "../curriculum"
import SectionForm from "../sectionForm"
import CurriculumForm from "../curriculumForm"
import { SectionType } from "../../pages/admin/course/CourseType"

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
    const section = props.section;
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
    console.log(props.index)
    console.log(props.prevNum)
    console.log(props.nextNum)
    return (
        <>
            {toggle.type !== "addSection" && <div className="section-insert">
                <button className="section-btn-insert" onClick={() => setToggle({ type: "addSection" })}>
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>
            }
            {toggle.type === "addSection" && <div className="section-add-form"> <SectionForm prevNum={props.prevNum} nextNum={props.nextNum} label='New Section' setToggle={setToggle} toggle={toggle} /></div>

            }

            <div className="section-container">
                <div className="section-header" onMouseEnter={handleMouseEnter} onMouseLeave={handlMouseLeave}>
                    {toggle.type !== "updateSection" &&
                        <>
                            <div className="title">
                                <span>Section {props.index + 1}:</span>
                                <AiOutlineFile className="icon-file" />
                                <span>{section.title}</span>
                            </div>
                            <div className="section-action" ref={headerRef}>
                                <div className="section-action-wrapper">
                                    <MdModeEdit className="icon-edit" onClick={() => setToggle({ type: "updateSection" })} />
                                    <FaTrash className="icon-trash" />
                                </div>
                            </div>
                        </>
                    }
                    {toggle.type === "updateSection" && <div className="section-header-form">
                        <SectionForm section={section} prevNum={section.number} nextNum={section.number} label={`Section ${props.index + 1}:`} setToggle={setToggle} toggle={toggle} />
                    </div>}
                </div>
                {section.curriculums.map((curriculum, index) => <Curriculum curriculum={curriculum} key={index} />)}

                <CurriculumForm toggle={toggle} setToggle={setToggle} type="button" />
            </div>
        </>
    )
}

export default Section