import { Dispatch, SetStateAction } from 'react'
import { AnswerType } from '../../types/CourseType'
import './AnswerLearning.style.scss'

type ProbType = {
    answer: AnswerType
    setSelectingAnswer: Dispatch<SetStateAction<number>>
    isAnswer: boolean
    selectingAnswer: number
    setIsAnswer: Dispatch<SetStateAction<boolean>>
}
function AnswerLearning(prob: ProbType) {
    const { answer, setSelectingAnswer, selectingAnswer, isAnswer, setIsAnswer } = prob;
    const handleClick = () => {
        answer.id && setSelectingAnswer(answer.id);
        setIsAnswer(false);
    }
    const getClassBySelection = (): string => {
        if (selectingAnswer == answer.id && isAnswer == false) {
            return "active"
        } else if (selectingAnswer == answer.id && isAnswer == true) {
            console.log(answer.correct);
            if (answer.correct == true) {
                return "correct";
            } else {
                return "incorrect";
            }
        }
        return ""
    }
    return (
        <div className={`answer-learning-container ${getClassBySelection()}`} dangerouslySetInnerHTML={{ __html: answer.answerText }} onClick={handleClick}></div>
    )
}

export default AnswerLearning