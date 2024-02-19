import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from 'react';
import './Answer.style.scss'
import { FaTrash } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import { AnswerType } from '../../types/CourseType';

const answerodules = {
    toolbar: [
        ['bold', 'italic'], ['code-block']
    ],
};

const answerFormats = [
    'bold', 'italic', 'code-block',
];
type Probs = {
    answer: AnswerType,
    handleAddAnswer: () => void
    handleRemoveAnswer: (id: number) => void
    index: number
    indexAnswerActive: number
    setIndexAnswerActive: Dispatch<SetStateAction<number>>
    setAnswers: Dispatch<SetStateAction<AnswerType[]>>
    answers: AnswerType[]
}
function Answer(probs: Probs) {
    const radioRef = useRef<HTMLInputElement | null>(null)
    const quillRef = useRef<ReactQuill>(null);
    const { answer, answers, handleAddAnswer, handleRemoveAnswer, index, indexAnswerActive, setAnswers, setIndexAnswerActive } = probs;
    const handleChecked = () => {
        if (radioRef.current) {
            radioRef.current.checked = true;
            const newAnswers = [...answers];
            newAnswers.forEach((answer, id) => {
                if (id === index) {
                    answer.correct = true;
                } else {
                    answer.correct = false;
                }
            })
            setAnswers(newAnswers);
        }
    };
    const handleChangeDesc = (value: string) => {
        const newAnswers = [...answers];
        newAnswers.forEach((answer, id) => {
            if (id === index) {
                answer.answerText = value;
            }
        })
        console.log(value);
        setAnswers(newAnswers);
    }

    const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
        const newReason = event.target.value;
        const newAnswers = [...answers];
        newAnswers.forEach((answer, id) => {
            if (id === index) {
                answer.reason = newReason;
            }
        })
        setAnswers(newAnswers);
    }

    useEffect(() => {
        if (radioRef.current && answer.correct === true) {
            radioRef.current.checked = true;
        }

    }, [answers])
    useEffect(() => {
        if (index === indexAnswerActive && quillRef.current) {
            quillRef.current.focus();
        }
    }, [indexAnswerActive])

    return (
        <div className="answer-container">

            <div className="radio">
                <input ref={radioRef} type="radio" name="radio" className='input-radio' />
                <span className='input-container'>
                    {index !== indexAnswerActive && index === answers.length - 1 && <p className='answer-text' onClick={() => {
                        setIndexAnswerActive(index), handleAddAnswer();
                    }}>
                        <span dangerouslySetInnerHTML={{ __html: answer.answerText === "" ? "<p>Add an answer</p>" : answer.answerText }}></span>
                    </p>}
                    {index !== indexAnswerActive && index !== answers.length - 1 && <p className='answer-text' onClick={() => {
                        setIndexAnswerActive(index);

                    }}>
                        <span dangerouslySetInnerHTML={{ __html: answer.answerText === "" ? "<p>Add an answer</p>" : answer.answerText }}></span>
                    </p>}
                    {index === indexAnswerActive && <div className="question-rte" ><ReactQuill ref={quillRef} modules={answerodules} formats={answerFormats} theme="snow" value={answer.answerText} onChange={(value: string) => handleChangeDesc(value)} /></div>}
                    <input type="text" className='answer-explain' placeholder="Explain Why this is or isn't the best answer" onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeReason(e)} value={answer.reason} />
                </span>
                <span onClick={handleChecked} className="checkmark"></span>
            </div>
            <div className="answer-icon">
                <FaTrash className="icon-trash" onClick={() => handleRemoveAnswer(index)} />
            </div>
        </div>
    )
}

export default Answer
