import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai"
import './Section.style.scss'
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { useRef, useState } from "react"
import 'react-quill/dist/quill.snow.css';
import Curriculum from "../curriculum"
import SectionForm from "../sectionForm"
import CurriculumForm from "../curriculumForm"

type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}

function Section() {
    const [toggle, setToggle] = useState<ToggleType>({ type: "button" });
    const headerRef = useRef<HTMLDivElement | null>(null);
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
    return (
        <>
            {toggle.type !== "addSection" && <div className="section-insert">
                <button className="section-btn-insert" onClick={() => setToggle({ type: "addSection" })}>
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>
            }
            {toggle.type === "addSection" && <SectionForm label='New Section' title='' setToggle={setToggle} toggle={toggle} />
            }
            <div className="section-container">
                <div className="section-header" onMouseEnter={handleMouseEnter} onMouseLeave={handlMouseLeave}>
                    {toggle.type !== "updateSection" &&
                        <>
                            <div className="title">
                                <span>Section 1:</span>
                                <AiOutlineFile className="icon-file" />
                                <span>Introduction</span>
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
                        <SectionForm label='Section 1:' title='Introduction' setToggle={setToggle} toggle={toggle} />
                    </div>}
                </div>
                <Curriculum title="Lecture test" type="lecture" />
                <Curriculum title="Lecture test" type="quiz" />
                <CurriculumForm toggle={toggle} setToggle={setToggle} type="button" />
            </div>
        </>
    )
}

export default Section