import { Button } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import './CurriculumForm.style.scss'
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import { useState } from "react";
import { ICurriculum } from "../../pages/admin/course/CourseType";
type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}
type ProbsType = {
    toggle: ToggleType
    setToggle?: (value: ToggleType) => void
    type: "button" | ""
    curriculum?: ICurriculum
}
const modules = {
    toolbar: [
        ['bold', 'italic'],  // Customize the toolbar to include only bold and italic options
    ],
};

const formats = [
    'bold', 'italic'
];
function CurriculumForm(probs: ProbsType) {
    const [descQuiz, setDescQuiz] = useState<string>();
    const [lectureTitle, setLectureTitle] = useState<string>()
    const [quizTitle, setQuizTitle] = useState<string>()
    const toggle = probs.toggle;
    const handleCreateLecture = async () => {
        // call api create lecture
    }
    const handleCreateQuiz = async () => {
        // call api create quiz
    }
    return (
        <div className="section-wraper">
            {(toggle.type === "button" || toggle.type == "updateSection") && probs.type == "button" && <Button onClick={() => probs.setToggle && probs.setToggle({ type: "select" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Curriculum item</Button>}
            {toggle.type !== "button" && probs.type == "button" && toggle.type !== "updateSection" && toggle.type !== "addSection" && <LiaTimesSolid className="icon-exist" onClick={() => probs.setToggle && probs.setToggle({ type: "button" })} />}
            {toggle.type !== "" && probs.type == "" && toggle.type !== "updateSection" && toggle.type !== "addSection" && <LiaTimesSolid className="icon-exist" onClick={() => probs.setToggle && probs.setToggle({ type: "" })} />}

            {toggle.type === "select" && <div className="add-item-forms">
                <div className="item-form" onClick={() => probs.setToggle && probs.setToggle({ type: "lecture" })}>
                    <AiOutlinePlus />
                    <span>Lecture</span>
                </div>
                <div className="item-form" onClick={() => probs.setToggle && probs.setToggle({ type: "quiz" })}>
                    <AiOutlinePlus />
                    <span>Quiz</span>
                </div>
            </div>
            }
            {toggle.type === "lecture" &&
                <div className="lecture-form">
                    <div className="lecture-form-item">
                        <div className="label">New Lecture: </div>
                        <input type="text" placeholder="Enter a Title" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
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
                        <input type="text" placeholder="Enter a Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
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
    )
}

export default CurriculumForm