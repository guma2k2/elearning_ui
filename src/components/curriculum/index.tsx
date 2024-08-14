import { GrStatusGood } from "react-icons/gr"
import { CurriculumType } from "./CurriculumType"
import { AiOutlineFile, AiOutlinePlus, AiOutlineQuestionCircle } from "react-icons/ai"
import { Button, Spin, Tabs, TabsProps } from "antd"
import './Curriculum.style.scss'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { ChangeEvent, Fragment, useRef, useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import InputFile from "../inputFile"
import { LiaTimesSolid } from "react-icons/lia"
import CurriculumForm from "../curriculumForm"
import { uploadFile } from "../../services/MediaService"
import { updateLecture } from "../../services/LectureService"
import { AnswerType, ILecture, QuestionType } from "../../types/CourseType"
import { QuestionPost } from "../../types/Question"
import { createQuestion, updateQuestion } from "../../services/QuestionService"
import QuestionForm from "../questionForm"
import { useAppDispatch } from "../../redux/hooks"
import { CurriculumPost, QuestionsPost, addQuestion, editQuestion, updateCurriculum } from "../../redux/slices/CourseSlice"

type ToggleType = {
    type: "desc" | "resources" | "lecture" | "quiz" | "dropdown" | "" | "content" | "questions" | "add" | "dropdownQuestion"

}
type ToggleFormType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}
const lectureModules = {
    toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Customize the toolbar to include only bold and italic options
    ],
};

const lectureFormats = [
    'bold', 'italic', 'list', 'bullet',
];

const answersClone: AnswerType[] = [
    {
        answerText: "",
        reason: "",
        correct: false
    },
    {
        answerText: "",
        reason: "",
        correct: false
    },
]
function Curriculum(probs: CurriculumType) {
    const { curriculum, sectionId, nextNum, prevNum } = probs;
    const lectureDescInit: string = curriculum.type == "lecture" && curriculum.lectureDetails ? curriculum.lectureDetails : "";
    const curriculumHeaderRef = useRef<HTMLDivElement | null>(null);
    const questionHeaderRef = useRef<HTMLDivElement | null>(null);
    const [toggleForm, setToggleForm] = useState<ToggleFormType>({ type: "" });
    const [toggle, setToggle] = useState<ToggleType>({ type: "" });
    const [lectureDesc, setLectureDesc] = useState<string>(lectureDescInit);
    const [questionDesc, setQuestionDesc] = useState<string>("");
    const [answers, setAnswers] = useState<AnswerType[]>(answersClone);
    const [indexAnswerActive, setIndexAnswerActive] = useState<number>(-1);
    const [questionId, setQuestionId] = useState<number | undefined>(-1);
    const [pendingLecture, setPendingLecture] = useState<boolean>(false)
    const fileRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            setPendingLecture(true);
            const selected = files[0];
            console.log(selected);
            var formData = new FormData();
            formData.append("file", selected);
            formData.append("type", "video");
            const res = await uploadFile(formData);
            console.log(res);

            if (res.status === 200) {
                const videoUrl = res.data.url;
                console.log(res.data.url);
                const duration = parseInt(res.data.duration);
                const lecturePost: LecturePost = {
                    ...curriculum, sectionId: sectionId, video: videoUrl, duration: duration
                }
                console.log(lecturePost);
                const resOfUploadVideoLecture = await updateLecture(lecturePost, curriculum.id);
                if (resOfUploadVideoLecture.status === 200) {
                    console.log((resOfUploadVideoLecture).data);
                    const data = resOfUploadVideoLecture.data
                    const request: CurriculumPost = {
                        sectionId,
                        curriculum: data
                    }
                    dispatch(updateCurriculum(request));
                    setToggle({ type: "" })
                    if (fileRef.current) {
                        fileRef.current.value = '';
                    }
                }
            }
            setPendingLecture(false);
        }
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Downloadable File',
            children: <InputFile title="Select File" handleFileChange={handleFileChange} fileRef={fileRef} />,
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
        setAnswers((prev) => [...prev, {
            answerText: "",
            reason: "",
            correct: false
        }]);
    }

    const handleRemoveAnswer = (answerIndex: number) => {

        setAnswers((prev) => prev.filter((_answer, index) => index !== answerIndex))
    }

    const handleViewQuestion = (questionId: number | undefined) => {
        console.log(questionId);
        if (curriculum.type == "quiz") {
            curriculum.questions?.forEach((question) => {
                if (question.id == questionId) {
                    setQuestionDesc(question.title)
                    setAnswers(question.answers)
                }
            })
        }
    }
    const handleSaveQuestion = async () => {
        if (curriculum) {
            const type = questionId && questionId < 0 ? "create" : "update";
            if (type == "create") {
                const questionPost: QuestionPost = {
                    title: questionDesc,
                    quizId: curriculum.id,
                    answers
                }
                console.log(questionPost);

                const res = await createQuestion(questionPost);
                if (res.status === 201) {
                    console.log(res.data);
                    setToggle({ type: "dropdownQuestion" })
                    const data = res.data as QuestionType;
                    let quizId: number = 0;
                    if (curriculum.id) {
                        quizId = curriculum.id;
                    }
                    const request: QuestionsPost = {
                        quizId,
                        question: data
                    }
                    dispatch(addQuestion(request));
                }
            } else {
                const questionPost: QuestionPost = {
                    id: questionId,
                    title: questionDesc,
                    quizId: curriculum.id,
                    answers
                }
                console.log(questionPost);
                const res = await updateQuestion(questionPost, questionId);
                if (res.status === 200) {
                    console.log(res.data);
                    const data = res.data as QuestionType;

                    let quizId: number = 0;
                    if (curriculum.id) {
                        quizId = curriculum.id;
                    }
                    const request: QuestionsPost = {
                        quizId,
                        question: data
                    }
                    dispatch(editQuestion(request));
                    setToggle({ type: "dropdownQuestion" })
                }
            }
        }
    }

    const handleUpdateLecture = async () => {
        if (curriculum) {
            const lecturePost: LecturePost = {
                ...curriculum, lectureDetails: lectureDesc, sectionId: sectionId
            }
            let lectureId: number = 0;
            if (curriculum.id) {
                lectureId = curriculum.id;
            }
            const res = await updateLecture(lecturePost, lectureId);
            if (res.status === 200) {
                console.log(res.data);
                const data = res.data as ILecture;
                const request: CurriculumPost = {
                    sectionId,
                    curriculum: data
                }
                dispatch(updateCurriculum(request));
                setToggle({ type: "dropdown" })
            }

        }
    }
    const resetForm = () => {
        const answersForm: AnswerType[] = [
            {
                answerText: "",
                reason: "",
                correct: false
            },
            {
                answerText: "",
                reason: "",
                correct: false
            },
        ];
        setIndexAnswerActive(-1);
        setAnswers(answersForm);
        setQuestionId(-1);
        setQuestionDesc("");
    }
    return (
        <>
            {toggleForm.type == "" && <div className="curriculum-insert">
                <button className="curriculum-btn-insert" onClick={() => setToggleForm({ type: "select" })}>
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>}
            {toggleForm.type !== "" && toggleForm.type !== "updateCurriculum" && <CurriculumForm sectionId={sectionId} prevNum={prevNum} nextNum={nextNum} curriculum={curriculum} toggle={toggleForm} setToggle={setToggleForm} type="" />}
            {toggleForm.type == "updateCurriculum" && <CurriculumForm sectionId={sectionId} curriculum={curriculum} toggle={{ type: "lecture" }} setToggle={setToggleForm} type="" />}
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
                            {toggle.type !== "resources" && toggle.type !== "content" && curriculum.type == "lecture" && !curriculum.videoId && <Button onClick={() => setToggle({ type: "content" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Content</Button>}
                            {toggle.type !== "resources" && toggle.type !== "questions" && curriculum.type == "quiz" && curriculum.questions && curriculum.questions?.length === 0
                                && <Button onClick={() => { setToggle({ type: "questions" }); }} className='btn-curriculum' icon={<AiOutlinePlus />}>Questions</Button>}
                            {curriculum.type == "lecture" && toggle.type == "" && <IoIosArrowDown onClick={() => setToggle({ type: "dropdown" })} />}
                            {curriculum.type == "lecture" && toggle.type == "dropdown" && <IoIosArrowUp onClick={() => setToggle({ type: "" })} />}
                            {curriculum.type == "quiz" && curriculum.questions && curriculum.questions?.length > 0 && toggle.type == "" && <IoIosArrowDown onClick={() => setToggle({ type: "dropdownQuestion" })} />}
                            {curriculum.type == "quiz" && toggle.type == "dropdownQuestion" && <IoIosArrowUp onClick={() => setToggle({ type: "" })} />}
                        </div>
                    </div>
                    {toggle.type == "dropdown" && <div className="curriculum-dropdown">
                        {(curriculum.type == "lecture" && curriculum.videoId && curriculum.videoId != "") && <Fragment>
                            <div className="curriculum-lecture-video-container">
                                <video width={100} height={100} controls className='curriculum-lecture-video-left'>
                                    <source src={curriculum.videoId} type='video/mp4' />
                                </video>
                                <div className="curriculum-lecture-video-right">
                                    <h3>lecture{curriculum.index}.mp4</h3>
                                    <div className="lecture-content-edit">
                                        <MdModeEdit className="icon-edit" />
                                        <span onClick={() => setToggle({ type: "content" })}>Chinh sua noi dung </span>
                                    </div>
                                </div>
                            </div></Fragment>}

                        <Button style={{ width: "8rem" }} onClick={() => setToggle({ type: "desc" })} className='btn-desc-curriculum' icon={<AiOutlinePlus />}>Description</Button>

                        {/* <Button style={{ width: "8rem" }} onClick={() => setToggle({ type: "resources" })} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button> */}
                    </div>
                    }
                    {
                        toggle.type == "dropdownQuestion" && <div className="curriculum-dropdown">
                            <div className="dropdown-questions-top">
                                <div className="left">
                                    <span>Questions</span>
                                    <Button onClick={() => { setToggle({ type: "questions" }); resetForm(); }} >New Question</Button>
                                </div>
                                <div className="right">
                                    {/* <Button>Preview</Button> */}
                                </div>
                            </div>
                            <div className="dropdown-questions-list">
                                {curriculum.type == "quiz" && curriculum.questions?.map((question, index) =>
                                    <div key={index} className="dropdown-questions-item" >
                                        <div className="left">
                                            <span>{index + 1}.  </span>
                                            <div dangerouslySetInnerHTML={{ __html: question.title }}></div>
                                        </div>
                                        <span className="right" ref={questionHeaderRef} >
                                            <MdModeEdit className="icon-edit"
                                                onClick={() => {
                                                    setToggle({ type: "questions" });
                                                    handleViewQuestion(question.id);
                                                    setQuestionId(question.id);
                                                    setIndexAnswerActive(0);
                                                }} />
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
                            <div className="lecture-rte"><ReactQuill modules={lectureModules}
                                formats={lectureFormats}
                                theme="snow"
                                value={lectureDesc}
                                onChange={setLectureDesc}
                                placeholder="Add a description. Include what students will be able to do after completing the lecture." /></div>
                            <div className="lecture-form-action">
                                <div style={{ cursor: "pointer" }} className="cancel" onClick={() => setToggle({ type: "dropdown" })}>Cancel</div>
                                <Button type="primary" onClick={handleUpdateLecture}>Save</Button>
                            </div>
                        </div>
                        <Button style={{ width: "8rem" }} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button>
                    </div>
                    }
                    {toggle.type == "resources" && <div className="curriculum-dropdown">
                        <div className="dropdown-bottom">
                            <div className="tab-title">
                                <span>Add Resources</span>
                                <span className="tab-title-icon"
                                    onClick={() => setToggle({ type: "dropdown" })}>
                                    <LiaTimesSolid />
                                </span>
                            </div>
                            <Tabs defaultActiveKey="1" items={items} />
                        </div>
                    </div>
                    }
                    {
                        toggle.type == "content" &&
                        <div className="curriculum-dropdown">
                            <div className="dropdown-bottom">
                                {curriculum.type == "lecture" && <Fragment>
                                    <div className="tab-title">
                                        <span>Add Video</span>
                                        <span className="tab-title-icon" onClick={() => {
                                            setToggle({ type: "dropdown" })
                                        }}><LiaTimesSolid /></span>
                                    </div>
                                    <Spin spinning={pendingLecture} tip="Loading..." ><InputFile fileRef={fileRef} title="Select Video"
                                        handleFileChange={handleFileChange} /></Spin>
                                </Fragment>
                                }
                            </div>
                        </div>
                    }
                    {toggle.type == "questions" &&
                        <div className="curriculum-dropdown">
                            <div className="dropdown-question-bottom">
                                <div className="tab-title">
                                    <span>Add Multiple Choice</span>
                                    <span className="tab-title-icon"
                                        onClick={() => {
                                            if (curriculum.type == "quiz" && curriculum.questions && curriculum.questions.length > 0) {
                                                setToggle({ type: "dropdownQuestion" });
                                            } else {
                                                setToggle({ type: "" });
                                            }
                                        }}>
                                        <LiaTimesSolid />
                                    </span>
                                </div>
                            </div>
                            <QuestionForm questionDesc={questionDesc}
                                setQuestionDesc={setQuestionDesc}
                                answers={answers}
                                handleAddAnswer={handleAddAnswer}
                                handleRemoveAnswer={handleRemoveAnswer}
                                setAnswers={setAnswers}
                                setIndexAnswerActive={setIndexAnswerActive}
                                indexAnswerActive={indexAnswerActive}
                                handleSaveQuestion={handleSaveQuestion}
                            />
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default Curriculum