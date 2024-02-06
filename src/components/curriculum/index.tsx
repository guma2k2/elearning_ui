import { GrStatusGood } from "react-icons/gr"
import { CurriculumType } from "./CurriculumType"
import { AiOutlineFile, AiOutlinePlus, AiOutlineQuestionCircle } from "react-icons/ai"
import { Button } from "antd"
import './Curriculum.style.scss'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import { useRef, useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';

type ToggleType = {
    type: "desc" | "resources" | "lecture" | "quiz" | "dropdown" | ""
}
const modules = {
    toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Customize the toolbar to include only bold and italic options
    ],
};

const formats = [
    'bold', 'italic', 'list', 'bullet',
];
function Curriculum(probs: CurriculumType) {
    const curriculumHeaderRef = useRef<HTMLDivElement | null>(null);
    const [toggle, setToggle] = useState<ToggleType>({ type: "" });
    const [lectureDesc, setLectureDesc] = useState<string>("");

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
                        <Button className='btn-curriculum' icon={<AiOutlinePlus />}>{probs.type == "lecture" ? "Content" : "Questions"}</Button>
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
                        <div className="lecture-rte"><ReactQuill modules={modules} formats={formats} theme="snow" value={lectureDesc} onChange={setLectureDesc} placeholder="Add a description. Include what students will be able to do after completing the lecture." /></div>
                        <div className="lecture-form-action">
                            <div style={{ cursor: "pointer" }} className="cancel" onClick={() => setToggle({ type: "dropdown" })}>Cancel</div>
                            <Button type="primary">Save</Button>
                        </div>
                    </div>
                    <Button style={{ width: "8rem" }} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button>
                </div>
                }
                {toggle.type == "resources" && <div className="curriculum-dropdown">
                    <div className="dropdown-bottom"></div>
                    <Button style={{ width: "8rem" }} type="default" className='btn-resources-curriculum' icon={<AiOutlinePlus />}>Resources</Button>
                </div>
                }
            </div>
        </>
    )
}

export default Curriculum