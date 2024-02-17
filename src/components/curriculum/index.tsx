import { GrStatusGood } from "react-icons/gr"
import { CurriculumType } from "./CurriculumType"
import { AiOutlineFile, AiOutlinePlus, AiOutlineQuestionCircle } from "react-icons/ai"
import { Button, Form, Input, Tabs, TabsProps } from "antd"
import './Curriculum.style.scss'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { ChangeEvent, useRef, useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import InputFile from "../inputFile"
import { LiaTimesSolid } from "react-icons/lia"
import CurriculumForm from "../curriculumForm"
import { uploadFile } from "../../services/MediaService"
import { update } from "../../services/LectureService"
import { AnswerType } from "../../types/CourseType"
import Answer from "../answer"
import { QuestionPost } from "../../types/Question"

type ToggleType = {
    type: "desc" | "resources" | "lecture" | "quiz" | "dropdown" | "" | "content" | "questions" | "add" | "dropdownQuestion"

}
type ToggleFormType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}
type FieldType = {
    title?: string;
    url?: string;
};
const lectureModules = {
    toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Customize the toolbar to include only bold and italic options
    ],
};

const lectureFormats = [
    'bold', 'italic', 'list', 'bullet',
];

const questionModules = {
    toolbar: [
        ['bold', 'italic'],
        ['code-block'], ['image']
    ],
};

const questionFormats = [
    'bold', 'italic', 'code-block', "image"
];
const answersClone: AnswerType[] = [
    {
        id: 1,
        answerText: "hello world",
        reason: "the author like",
        correct: true
    },
    {
        id: 1,
        answerText: "hello world2",
        reason: "the author like",
        correct: false
    },
]
const answerClone: AnswerType = {
    answerText: "",
    reason: "",
    correct: false
}
function Curriculum(probs: CurriculumType) {
    const curriculumHeaderRef = useRef<HTMLDivElement | null>(null);
    const questionHeaderRef = useRef<HTMLDivElement | null>(null);
    const [toggleForm, setToggleForm] = useState<ToggleFormType>({ type: "" });
    const [toggle, setToggle] = useState<ToggleType>({ type: "" });
    const [lectureDesc, setLectureDesc] = useState<string>("");
    const [questionDesc, setQuestionDesc] = useState<string>("");
    const [answers, setAnswers] = useState<AnswerType[]>(answersClone);
    const [indexAnswerActive, setIndexAnswerActive] = useState<number>(-1);
    const fileRef = useRef<HTMLInputElement>(null);
    const onFinish = (values: FieldType) => {
        console.log(values);
    }
    const curriculum = probs.curriculum;
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(curriculum);

        if (files && files.length > 0) {
            const selected = files[0];
            console.log(selected);
            var formData = new FormData();
            formData.append("file", selected);
            formData.append("type", "video");
            const res = await uploadFile(formData);
            if (res.status === 200) {
                const videoId = res.data.id;
                const duration = res.data.duration;
                const lecturePost: LecturePost = {
                    ...curriculum, sectionId: probs.sectionId, videoId: videoId, duration: duration
                }
                console.log(lecturePost);
                const resOfUploadVideoLecture = await update(lecturePost, curriculum.id);
                if (resOfUploadVideoLecture.status === 200) {
                    console.log((resOfUploadVideoLecture).data);
                    setToggle({ type: "" })
                    if (fileRef.current) {
                        fileRef.current.value = '';
                    }
                }
            }
        }
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Downloadable File',
            children: <InputFile title="Select File" handleFileChange={handleFileChange} fileRef={fileRef} />,
        },
        {
            key: '2',
            label: 'External Resource',
            children: <Form
                layout="vertical"
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 24 }}
                style={{ minWidth: "100%" }}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="URL"
                    name="url"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }} style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" htmlType="submit">
                        Add Link
                    </Button>
                </Form.Item>
            </Form>,
        }
    ];
    const handleMouseEnter = () => {
        if (curriculumHeaderRef.current) {
            curriculumHeaderRef.current.style.opacity = "1";
        }
    }

    const handlMouseLeave = () => {
        if (curriculumHeaderRef.current) {
            curriculumHeaderRef.current.style.opacity = "0";
        }
    }

    const handleAddAnswer = () => {
        setAnswers((prev) => [...prev, answerClone]);
    }

    const handleRemoveAnswer = (answerIndex: number) => {
        setAnswers((prev) => prev.filter((answer, index) => index !== answerIndex))
    }

    const handleSaveQuestion = () => {
        if (curriculum) {
            const questionPost: QuestionPost = {
                title: questionDesc,
                quizId: curriculum.id,
                answers
            }
            console.log(questionPost);
        }
    }
    return (
        <>
            {toggleForm.type == "" && <div className="curriculum-insert">
                <button className="curriculum-btn-insert" onClick={() => setToggleForm({ type: "select" })}>
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>}
            {toggleForm.type !== "" && toggleForm.type !== "updateCurriculum" && <CurriculumForm sectionId={probs.sectionId} prevNum={probs.prevNum} nextNum={probs.nextNum} curriculum={curriculum} toggle={toggleForm} setToggle={setToggleForm} type="" />}
            {toggleForm.type == "updateCurriculum" && <CurriculumForm sectionId={probs.sectionId} curriculum={curriculum} toggle={{ type: "lecture" }} setToggle={setToggleForm} type="" />}
            {toggleForm.type !== "updateCurriculum" &&
                <div className="curriculum-container" onMouseLeave={handlMouseLeave} onMouseEnter={handleMouseEnter}>
                    <div className="curriculum-wrapper">
                        <div className="curriculum-left">
                            <GrStatusGood />
                            <span>{curriculum.type === "lecture" ? "Lecture" : "Quiz"} {curriculum.index}:</span>
                            {curriculum.type == "lecture" ? <AiOutlineFile /> : <AiOutlineQuestionCircle />}
                            <span>{curriculum.title}</span>
                            <span className="curriculum-action" ref={curriculumHeaderRef} >
                                <MdModeEdit className="icon-edit" onClick={() => setToggleForm({ type: "updateCurriculum" })} />
                                <FaTrash className="icon-trash" />
                            </span>
                        </div>
                        <div className="curriculum-right">
                            {toggle.type !== "resources" && toggle.type !== "content" && curriculum.type == "lecture" && <Button onClick={() => setToggle({ type: "content" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Content</Button>}
                            {toggle.type !== "resources" && toggle.type !== "questions" && curriculum.type == "quiz" && curriculum.questions && curriculum.questions?.length === 0 && <Button onClick={() => setToggle({ type: "questions" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Questions</Button>}
                            {curriculum.type == "lecture" && toggle.type == "" && <IoIosArrowDown onClick={() => setToggle({ type: "dropdown" })} />}
                            {curriculum.type == "lecture" && toggle.type == "dropdown" && <IoIosArrowUp onClick={() => setToggle({ type: "" })} />}
                            {curriculum.type == "quiz" && curriculum.questions && curriculum.questions?.length > 0 && toggle.type == "" && <IoIosArrowDown onClick={() => setToggle({ type: "dropdownQuestion" })} />}
                            {curriculum.type == "quiz" && toggle.type == "dropdownQuestion" && <IoIosArrowUp onClick={() => setToggle({ type: "" })} />}
                        </div>
                    </div>
                    {toggle.type == "dropdown" && <div className="curriculum-dropdown">
                        <Button style={{ width: "8rem" }} onClick={() => setToggle({ type: "desc" })} className='btn-desc-curriculum' icon={<AiOutlinePlus />}>Description</Button>
                        <Button style={{ width: "8rem" }} onClick={() => setToggle({ type: "resources" })} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button>
                    </div>
                    }
                    {
                        toggle.type == "dropdownQuestion" && <div className="curriculum-dropdown">
                            <div className="dropdown-questions-top">
                                <div className="left">
                                    <span>Questions</span>
                                    <Button onClick={() => setToggle({ type: "questions" })} >New Question</Button>
                                </div>
                                <div className="right">
                                    <Button>Preview</Button>
                                </div>
                            </div>
                            <div className="dropdown-questions-list">
                                {curriculum.type == "quiz" && curriculum.questions?.map((question, index) =>
                                    <div key={index} className="dropdown-questions-item" >
                                        <div className="left">
                                            <span>{index + 1}. {question.title} </span>
                                        </div>
                                        <span className="right" ref={questionHeaderRef} >
                                            <MdModeEdit className="icon-edit" onClick={() => setToggle({ type: "questions" })} />
                                            <FaTrash className="icon-trash" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    {toggle.type == "desc" && <div className="curriculum-dropdown">
                        <div className="dropdown-top">
                            <span>Lecture Description</span>
                            <div className="lecture-rte"><ReactQuill modules={lectureModules} formats={lectureFormats} theme="snow" value={lectureDesc} onChange={setLectureDesc} placeholder="Add a description. Include what students will be able to do after completing the lecture." /></div>
                            <div className="lecture-form-action">
                                <div style={{ cursor: "pointer" }} className="cancel" onClick={() => setToggle({ type: "dropdown" })}>Cancel</div>
                                <Button type="primary">Save</Button>
                            </div>
                        </div>
                        <Button style={{ width: "8rem" }} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button>
                    </div>
                    }
                    {toggle.type == "resources" && <div className="curriculum-dropdown">
                        <div className="dropdown-bottom">
                            <div className="tab-title">
                                <span>Add Resources</span>
                                <span className="tab-title-icon" onClick={() => setToggle({ type: "dropdown" })}><LiaTimesSolid /></span>
                            </div>
                            <Tabs defaultActiveKey="1" items={items} />
                        </div>
                    </div>
                    }
                    {
                        toggle.type == "content" &&
                        <div className="curriculum-dropdown">
                            <div className="dropdown-bottom">
                                <div className="tab-title">
                                    <span>Add Video</span>
                                    <span className="tab-title-icon" onClick={() => setToggle({ type: "dropdown" })}><LiaTimesSolid /></span>
                                </div>
                                <InputFile fileRef={fileRef} title="Select Video" handleFileChange={handleFileChange} />
                            </div>
                        </div>
                    }
                    {toggle.type == "questions" &&
                        <div className="curriculum-dropdown">
                            <div className="dropdown-question-bottom">
                                <div className="tab-title">
                                    <span>Add Multiple Choice</span>
                                    <span className="tab-title-icon" onClick={() => setToggle({ type: "" })}><LiaTimesSolid /></span>
                                </div>
                            </div>
                            <div className="curriculum-question">
                                <span>Question</span>
                                <div className="question-rte"><ReactQuill modules={questionModules} formats={questionFormats} theme="snow" value={questionDesc} onChange={setQuestionDesc} /></div>
                            </div>
                            <div className="curriculum-answers">
                                <span>Answer</span>
                                <div className="curriculum-answers-container">
                                    {answers && answers.map((answer, index) => {
                                        return <Answer answer={answer} key={index} handleAddAnswer={handleAddAnswer} handleRemoveAnswer={handleRemoveAnswer} index={index} setAnswers={setAnswers} answers={answers} setIndexAnswerActive={setIndexAnswerActive} indexAnswerActive={indexAnswerActive} />
                                    }
                                    )}
                                </div>
                                <div className="answer-action">
                                    <Button onClick={handleSaveQuestion} className="btn-question-save" >Save</Button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default Curriculum