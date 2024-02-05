import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai"
import './Section.style.scss'
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { Button } from "antd"
import { useState } from "react"
import { LiaTimesSolid } from "react-icons/lia"
import Curriculum from "../curriculum"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz"
}
function Section() {
    const [toggle, setToggle] = useState<ToggleType>({ type: "button" });
    const [descQuiz, setDescQuiz] = useState<string>();
    return (
        <div className="section-container">
            <div className="section-header">
                <div className="title">
                    <AiOutlineFile className="icon-file" />
                    <span>Introduction</span>
                </div>
                <div className="section-action">
                    <div className="section-action-wrapper">
                        <MdModeEdit className="icon-edit" />
                        <FaTrash className="icon-trash" />
                    </div>
                </div>
            </div>
            <div className="section-wraper">
                {toggle.type === "button" && <Button onClick={() => setToggle({ type: "select" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Curriculum item</Button>}
                <LiaTimesSolid className="icon-exist" onClick={() => setToggle({ type: "button" })} />
                {toggle.type === "select" && <div className="add-item-forms">
                    <Curriculum setToggle={setToggle} type="lecture" title="Lecture" />
                    <Curriculum setToggle={setToggle} type="quiz" title="Quiz" />
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
                            <div className="quiz-rte"><ReactQuill formats={['bold']} theme="snow" value={descQuiz} onChange={setDescQuiz} placeholder="Quiz Description" /></div>
                        </div>
                        <div className="quiz-form-action">
                            <div className="cancel">Cancel</div>
                            <Button type="primary">Add Quiz</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Section