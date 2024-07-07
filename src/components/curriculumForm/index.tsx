import { Button } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import './CurriculumForm.style.scss'
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import { useState } from "react";
import { ICurriculum, ILecture, IQuiz } from "../../types/CourseType";
import { createLecture, updateLecture } from "../../services/LectureService";
import { useAppDispatch } from "../../redux/hooks";
import { CurriculumPost, addCurriculum, updateCurriculum } from "../../redux/slices/CourseSlice";
import { QuizPost } from "../../types/QuizType";
import { createQuiz, updateQuiz } from "../../services/QuizService";
type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}
type ProbsType = {
    toggle: ToggleType
    setToggle?: (value: ToggleType) => void
    type: "button" | ""
    curriculum?: ICurriculum
    sectionId: number
    prevNum?: number
    nextNum?: number
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
    const [descQuiz, setDescQuiz] = useState<string>("");



    const { sectionId, toggle, type, curriculum, nextNum, prevNum, setToggle } = probs;
    const title: string = curriculum ? curriculum.title : "";
    const [quizTitle, setQuizTitle] = useState<string>(title)
    const [lectureTitle, setLectureTitle] = useState<string>(title)
    const dispatch = useAppDispatch();
    const handleCreateLecture = async () => {
        const type = curriculum ? "update" : "create";
        console.log(type);

        const lecturePost: LecturePost = {
            title: lectureTitle,
            number: getNumber(),
            sectionId: sectionId
        }
        if (type == "create") {
            const res = await createLecture(lecturePost);
            console.log(res);
            if (res.status === 201) {
                console.log(res.data);

                const data = res.data as ILecture;
                const curriculumPost: CurriculumPost = {
                    curriculum: data,
                    sectionId
                }
                dispatch(addCurriculum(curriculumPost))
                handleToggle()
            }
        } else if (type == "update") {
            const res = await updateLecture(lecturePost, curriculum?.id);
            console.log(res);
            if (res.status === 200) {
                console.log(res.data);

                const data = res.data as ILecture;
                const curriculumPost: CurriculumPost = {
                    curriculum: data,
                    sectionId
                }
                dispatch(updateCurriculum(curriculumPost))
                handleToggle()
            }
        }
    }
    console.log(lectureTitle);
    const handleToggle = () => {
        if (setToggle) {
            if (probs.type == "") {
                setToggle({ type: "" })
            } else if (probs.type == "button") {
                setToggle({ type: "button" })
            }
        }
    }
    const handleCreateQuiz = async () => {
        const type = curriculum ? "update" : "create";

        const quizPost: QuizPost = {
            title: quizTitle,
            number: getNumber(),
            description: descQuiz,
            sectionId: sectionId
        }
        if (type == "create") {
            const res = await createQuiz(quizPost);
            console.log(res);
            if (res.status === 201) {
                console.log(res.data);
                const data = res.data as IQuiz;
                const curriculumPost: CurriculumPost = {
                    curriculum: data,
                    sectionId
                }
                dispatch(addCurriculum(curriculumPost))
                handleToggle()
            }
        } else if (type == "update") {
            console.log(lectureTitle);
            const res = await updateQuiz(quizPost, curriculum?.id);
            console.log(res);
            if (res.status === 200) {
                console.log(res.data);
                const data = res.data as IQuiz;
                const curriculumPost: CurriculumPost = {
                    curriculum: data,
                    sectionId
                }
                dispatch(updateCurriculum(curriculumPost))
                handleToggle()
            }
        }
    }

    const getNumber = (): number => {
        let number = 0;
        console.log(prevNum);
        if (prevNum && nextNum) {
            number = prevNum && nextNum && prevNum == nextNum ? prevNum : (prevNum + nextNum) / 2
        }
        return number;
    }
    return (
        <div className="section-wraper">
            {(toggle.type === "button" || toggle.type == "updateSection") && type == "button" && <Button onClick={() => setToggle && setToggle({ type: "select" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Curriculum item</Button>}
            {toggle.type !== "button" && type == "button" && toggle.type !== "updateSection" && toggle.type !== "addSection" && <LiaTimesSolid className="icon-exist" onClick={() => setToggle && setToggle({ type: "button" })} />}
            {toggle.type !== "" && type == "" && toggle.type !== "updateSection" && toggle.type !== "addSection" && <LiaTimesSolid className="icon-exist" onClick={() => setToggle && setToggle({ type: "" })} />}

            {toggle.type === "select" && <div className="add-item-forms">
                <div className="item-form" onClick={() => setToggle && setToggle({ type: "lecture" })}>
                    <AiOutlinePlus />
                    <span>Lecture</span>
                </div>
                <div className="item-form" onClick={() => setToggle && setToggle({ type: "quiz" })}>
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
                        <div className="lecture-form-cancel-btn" onClick={() => setToggle && setToggle({ type: "" })}>Cancel</div>
                        <Button type="primary" onClick={handleCreateLecture} >{curriculum ? "Update lecture" : "Add Lecture"}</Button>
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
                        <div className="quiz-form-cancel-btn" onClick={() => setToggle && setToggle({ type: "" })}>Cancel</div>
                        <Button type="primary" onClick={handleCreateQuiz}> {curriculum ? "Update quiz" : "Add quiz"}</Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default CurriculumForm

