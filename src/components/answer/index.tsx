import { useRef, useState } from 'react';
import './Answer.style.scss'
import { FaTrash } from 'react-icons/fa';
import ReactQuill from 'react-quill';

const answerodules = {
    toolbar: [
        ['bold', 'italic'], ['code-block']
    ],
};

const answerFormats = [
    'bold', 'italic', 'code-block',
];
function Answer() {
    const [toggle, setToggle] = useState<boolean>(false)
    const [answerDesc, setAnswerDesc] = useState<string>("")
    const radioRef = useRef<HTMLInputElement | null>(null)
    const handleChecked = () => {
        if (radioRef.current) {
            radioRef.current.checked = true;
        }
    };

    return (
        <div className="answer-container">
            <div className="radio">
                <input ref={radioRef} type="radio" name="radio" className='input-radio' />
                <span className='input-container'>
                    {toggle == false && <p className='answer-text' onClick={() => setToggle(true)}>
                        <span>Add an answer</span>
                    </p>}
                    {toggle == true && <div className="question-rte" ><ReactQuill modules={answerodules} formats={answerFormats} theme="snow" value={answerDesc} onChange={setAnswerDesc} /></div>}
                    <input type="text" className='answer-explain' placeholder="Explain Why this is or isn't the best answer" />
                </span>
                <span onClick={handleChecked} className="checkmark"></span>
            </div>
            <div className="answer-icon">
                <FaTrash className="icon-trash" />
            </div>
        </div>
    )
}

export default Answer