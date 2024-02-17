import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
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
    const handleChecked = () => {
        if (radioRef.current) {
            radioRef.current.checked = true;
            const newAnswers = [...probs.answers];
            newAnswers.forEach((answer, index) => {
                if (index === probs.index) {
                    answer.correct = true;
                } else {
                    answer.correct = false;
                }
            })
            probs.setAnswers(newAnswers);
        }
    };
    const handleChangeDesc = (value: string) => {
        const newAnswers = [...probs.answers];
        newAnswers.forEach((answer, index) => {
            if (index === probs.index) {
                answer.answerText = value;
            }
        })
        probs.setAnswers(newAnswers);
    }

    const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
        const newReason = event.target.value;
        const newAnswers = [...probs.answers];
        newAnswers.forEach((answer, index) => {
            if (index === probs.index) {
                answer.reason = newReason;
            }
        })
        probs.setAnswers(newAnswers);
    }

    useEffect(() => {
        if (radioRef.current && probs.answer.correct === true) {
            radioRef.current.checked = true;
        }

    }, [probs.answers])
    useEffect(() => {
        console.log(probs.index);
        console.log(probs.indexAnswerActive);

        if (probs.index === probs.indexAnswerActive && quillRef.current) {
            quillRef.current.focus();
        }
    }, [probs.indexAnswerActive])

    return (
        <div className="answer-container">
            <div className="radio">
                <input ref={radioRef} type="radio" name="radio" className='input-radio' />
                <span className='input-container'>
                    {probs.index !== probs.indexAnswerActive && probs.index === probs.answers.length - 1 && <p className='answer-text' onClick={() => {
                        probs.setIndexAnswerActive(probs.index), probs.handleAddAnswer();
                    }}>
                        <span>Add an answer</span>
                    </p>}
                    {probs.index !== probs.indexAnswerActive && probs.index !== probs.answers.length - 1 && <p className='answer-text' onClick={() => {
                        probs.setIndexAnswerActive(probs.index);

                    }}>
                        <span>Add an answer</span>
                    </p>}
                    {probs.index === probs.indexAnswerActive && <div className="question-rte" ><ReactQuill ref={quillRef} modules={answerodules} formats={answerFormats} theme="snow" value={probs.answer.answerText} onChange={(value: string) => handleChangeDesc(value)} /></div>}
                    <input type="text" className='answer-explain' placeholder="Explain Why this is or isn't the best answer" onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeReason(e)} value={probs.answer.reason} />
                </span>
                <span onClick={handleChecked} className="checkmark"></span>
            </div>
            <div className="answer-icon">
                <FaTrash className="icon-trash" onClick={() => probs.handleRemoveAnswer(probs.index)} />
            </div>
        </div>
    )
}

export default Answer
