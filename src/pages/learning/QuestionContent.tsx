import { Select } from "antd";
import { useState } from "react";
import './QuestionContent.style.scss'
import { MdOutlineQuestionAnswer } from "react-icons/md";
function QuestionContent() {
    const [selection, setSelection] = useState<string>("ALL")
    return <div className="question-lecture-container">
        <div className="question-lecture-filter">
            <span>Bộ lọc:</span>
            <Select
                style={{ width: "250px", height: "100%" }}
                value={selection}
                onChange={(value) => {
                    alert(value);
                    setSelection(value);
                }}
            >
                <Select.Option value="ALL">Tất cả các bài giảng</Select.Option>
                <Select.Option value="1">Trong bài học này</Select.Option>
            </Select>
        </div>
        <div className="question-lecture-wrapper">
            <span className="question-lecture-header">Các câu hỏi nổi bật trong khóa học này</span>
            <div className="question-lecture-item">
                <div className="question-lecture-left">
                    <img className="question-lecture" src="https://img.freepik.com/free-vector/letter-brush-stroke-typography-vector_53876-175299.jpg?semt=ais_hybrid" alt="student-picture" />
                </div>
                <div className="question-lecture-middle">
                    <h3 className="question-lecture-title">REST Service Request</h3>
                    <div className="question-lecture-description">Hi NamWhy did you choose to use a REST service call to check the email uniqueness ?</div>
                    <div className="question-lecture-time">
                        <span>Bài giảng số 1</span>
                        <span>1 ngay trước</span>
                    </div>
                </div>
                <div className="question-lecture-right">
                    <span>20</span>
                    <MdOutlineQuestionAnswer className="question-lecture-icon" />
                </div>
            </div>
        </div>
    </div>
}

export default QuestionContent;