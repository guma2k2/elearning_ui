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
            const newAnswers = answers.map((ans, id) => {
                if (id === index) {
                    return { ...ans, correct: true };
                } else {
                    return { ...ans, correct: false };
                }
            });
            console.log(newAnswers);
            setAnswers(newAnswers);
        }
    };
    const handleChangeDesc = (value: string) => {
        console.log(index);
        const newAnswers = [...answers];
        newAnswers.forEach((ans, id) => {
            if (id === index) {
                ans.answerText = value;
            }
        })
        console.log(newAnswers);
        setAnswers(newAnswers);
    }

    // const handleChangeCorrect = (e: ChangeEvent<HTMLInputElement>) => {
    //     console.log(e.target.value);
    // }

    const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
        const newReason = event.target.value;
        const newAnswers = [...answers];
        newAnswers.forEach((ans, id) => {
            if (id === index) {
                ans.reason = newReason;
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
