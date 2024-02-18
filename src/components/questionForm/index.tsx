import { Button } from "antd";
import ReactQuill from "react-quill"
import Answer from "../answer";
import { Dispatch, SetStateAction } from "react";
import { AnswerType } from "../../types/CourseType";
const questionModules = {
  toolbar: [
    ['bold', 'italic'],
    ['code-block'], ['image']
  ],
};

const questionFormats = [
  'bold', 'italic', 'code-block', "image"
];
type Propbs = {
  questionDesc: string,
  setQuestionDesc: Dispatch<SetStateAction<string>>
  answers: AnswerType[]
  handleAddAnswer: () => void
  handleRemoveAnswer: (answerIndex: number) => void
  setAnswers: Dispatch<SetStateAction<AnswerType[]>>
  setIndexAnswerActive: Dispatch<SetStateAction<number>>
  indexAnswerActive: number
  handleSaveQuestion: () => Promise<void>
}
function QuestionForm(probs: Propbs) {
  const { answers, handleAddAnswer, handleRemoveAnswer, handleSaveQuestion, indexAnswerActive, questionDesc, setAnswers, setIndexAnswerActive, setQuestionDesc } = probs;
  return (
    <>
      <div className="curriculum-question">
        <span>Question</span>
        <div className="question-rte">
          <ReactQuill
            modules={questionModules}
            formats={questionFormats}
            theme="snow"
            value={questionDesc}
            onChange={setQuestionDesc} />
        </div>
      </div>
      <div className="curriculum-answers">
        <span>Answer</span>
        <div className="curriculum-answers-container">
          {answers && answers.map((answer, index) => {
            return <Answer answer={answer} key={index}
              handleAddAnswer={handleAddAnswer}
              handleRemoveAnswer={handleRemoveAnswer}
              index={index}
              setAnswers={setAnswers}
              answers={answers}
              setIndexAnswerActive={setIndexAnswerActive}
              indexAnswerActive={indexAnswerActive} />
          }
          )}
        </div>
        <div className="answer-action">
          <Button onClick={handleSaveQuestion} className="btn-question-save" >Save</Button>
        </div>
      </div>
    </>
  )
}

export default QuestionForm