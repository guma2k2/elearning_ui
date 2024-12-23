import { Button } from "antd";
import Answer from "../answer";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { AnswerType } from "../../types/CourseType";
import ReactQuill from "react-quill";



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
  setQuestionDesc: React.Dispatch<React.SetStateAction<string>>
  answers: AnswerType[]
  handleAddAnswer: () => void
  handleRemoveAnswer: (answerIndex: number) => void
  setAnswers: Dispatch<SetStateAction<AnswerType[]>>
  setIndexAnswerActive: Dispatch<SetStateAction<number>>
  indexAnswerActive: number
  handleSaveQuestion: () => Promise<void>
}
function QuestionForm(probs: Propbs) {
  const quillRef: React.LegacyRef<ReactQuill> = useRef(null);
  const { answers, handleAddAnswer, handleRemoveAnswer, handleSaveQuestion, indexAnswerActive, questionDesc, setAnswers, setIndexAnswerActive, setQuestionDesc } = probs;
  return (
    <>
      <div className="curriculum-question">
        <span>Question</span>
        <div className="question-rte">
          <ReactQuill
            ref={quillRef}
            modules={questionModules}
            formats={questionFormats}
            theme="snow"
            value={questionDesc}
            onChange={setQuestionDesc} />
        </div>
      </div>
      <div className="curriculum-answers">
        <span>Câu trả lời</span>
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
          <Button onClick={handleSaveQuestion} className="btn-question-save" >Lưu</Button>
        </div>
      </div>
    </>
  )
}

export default QuestionForm