import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai"
import './Section.style.scss'
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { Button } from "antd"
import { useRef, useState } from "react"
import { LiaTimesSolid } from "react-icons/lia"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Curriculum from "../curriculum"

type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz"
}
const modules = {
    toolbar: [
        ['bold', 'italic'],  // Customize the toolbar to include only bold and italic options
    ],
};

const formats = [
    'bold', 'italic'
];
function Section() {
    const [toggle, setToggle] = useState<ToggleType>({ type: "button" });
    const [descQuiz, setDescQuiz] = useState<string>();
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
            <div className="section-insert">
                <button className="section-btn-insert">
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>
            <div className="section-container">
                <div className="section-header" onMouseEnter={handleMouseEnter} onMouseLeave={handlMouseLeave}>
                    <div className="title">
                        <AiOutlineFile className="icon-file" />
                        <span>Introduction</span>
                    </div>
                    <div className="section-action" ref={headerRef}>
                        <div className="section-action-wrapper">
                            <MdModeEdit className="icon-edit" />
                            <FaTrash className="icon-trash" />
                        </div>
                    </div>
                </div>
                <Curriculum title="Lecture test" type="lecture" />
                <Curriculum title="Lecture test" type="quiz" />
                <div className="section-wraper">
                    {toggle.type === "button" && <Button onClick={() => setToggle({ type: "select" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Curriculum item</Button>}
                    {toggle.type != "button" && <LiaTimesSolid className="icon-exist" onClick={() => setToggle({ type: "button" })} />}
                    {toggle.type === "select" && <div className="add-item-forms">
                        <div className="item-form" onClick={() => setToggle({ type: "lecture" })}>
                            <AiOutlinePlus />
                            <span>Lecture</span>
                        </div>
                        <div className="item-form" onClick={() => setToggle({ type: "quiz" })}>
                            <AiOutlinePlus />
                            <span>Quiz</span>
                        </div>
                    </div>
                    }
                    {toggle.type === "lecture" &&
                        <div className="lecture-form">
                            <div className="lecture-form-item">
                                <div className="label">New Lecture: </div>
                                <input type="text" placeholder="Enter a Title" />
                            </div>
                            <div className="lecture-form-action">
                                <div className="cancel">Cancel</div>
                                <Button type="primary">Add Lecture</Button>
                            </div>
                        </div>
                    }
                    {toggle.type === "quiz" &&
                        <div className="quiz-form">
                            <div className="quiz-form-item">
                                <div className="label">New Quiz: </div>
                                <input type="text" placeholder="Enter a Title" />
                            </div>
                            <div className="quiz-form-item">
                                <div className="label"></div>
                                <div className="quiz-rte"><ReactQuill modules={modules} formats={formats} theme="snow" value={descQuiz} onChange={setDescQuiz} placeholder="Quiz Description" /></div>
                            </div>
                            <div className="quiz-form-action">
                                <div className="cancel">Cancel</div>
                                <Button type="primary">Add Quiz</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Section