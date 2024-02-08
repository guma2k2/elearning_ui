import { GrStatusGood } from "react-icons/gr"
import { CurriculumType } from "./CurriculumType"
import { AiOutlineFile, AiOutlinePlus, AiOutlineQuestionCircle } from "react-icons/ai"
import { Button, Form, Input, Tabs, TabsProps } from "antd"
import './Curriculum.style.scss'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { useRef, useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import InputFile from "../inputFile"
import { LiaTimesSolid } from "react-icons/lia"
import Answer from "../answer"

type ToggleType = {
    type: "desc" | "resources" | "lecture" | "quiz" | "dropdown" | "" | "content" | "questions"
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
function Curriculum(probs: CurriculumType) {
    const curriculumHeaderRef = useRef<HTMLDivElement | null>(null);
    const [toggle, setToggle] = useState<ToggleType>({ type: "" });
    const [lectureDesc, setLectureDesc] = useState<string>("");
    const [questionDesc, setQuestionDesc] = useState<string>("");
    const onFinish = (values: FieldType) => {
        console.log(values);
    }
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Downloadable File',
            children: <InputFile title="Select File" />,
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
    return (
        <>
            <div className="curriculum-insert">
                <button className="curriculum-btn-insert">
                    <AiOutlinePlus className="section-icon-insert" />
                </button>
            </div>
            <div className="curriculum-container" onMouseLeave={handlMouseLeave} onMouseEnter={handleMouseEnter}>
                <div className="curriculum-wrapper">
                    <div className="curriculum-left">
                        <GrStatusGood />
                        <span>Lecture 1:</span>
                        {probs.type == "lecture" ? <AiOutlineFile /> : <AiOutlineQuestionCircle />}
                        <span>{probs.title}</span>
                        <span className="curriculum-action" ref={curriculumHeaderRef} >
                            <MdModeEdit className="icon-edit" />
                            <FaTrash className="icon-trash" />
                        </span>
                    </div>
                    <div className="curriculum-right">
                        {toggle.type !== "resources" && toggle.type !== "content" && probs.type == "lecture" && <Button onClick={() => setToggle({ type: "content" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Content</Button>}
                        {toggle.type !== "resources" && toggle.type !== "questions" && probs.type == "quiz" && <Button onClick={() => setToggle({ type: "questions" })} className='btn-curriculum' icon={<AiOutlinePlus />}>Questions</Button>}
                        {probs.type == "lecture" && toggle.type == "" && <IoIosArrowDown onClick={() => setToggle({ type: "dropdown" })} />}
                        {probs.type == "lecture" && toggle.type == "dropdown" && <IoIosArrowUp onClick={() => setToggle({ type: "" })} />}
                    </div>
                </div>
                {toggle.type == "dropdown" && <div className="curriculum-dropdown">
                    <Button style={{ width: "8rem" }} onClick={() => setToggle({ type: "desc" })} className='btn-desc-curriculum' icon={<AiOutlinePlus />}>Description</Button>
                    <Button style={{ width: "8rem" }} onClick={() => setToggle({ type: "resources" })} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button>
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
                            <InputFile title="Select Video" />
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
                                <Answer />
                                <Answer />
                                <Answer />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Curriculum