import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select } from "antd";
import { AnswerLecturePostType, AnswerLectureType, QuestionLectureType } from "../../../../types/QuestionLectureType";
import { createUserAnswerLecture, deleteUserAnswerLecture, updateUserAnswerLecture } from "../../../../services/UserAnswerService";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { ErrorType } from "../../../../types/ErrorType";
import { getByCourse, getBySection } from "../../../../services/QuestionLectureService";
import { fetchCourseById } from "../../../../redux/slices/CourseSlice";
import { MdOutlineEdit, MdOutlineQuestionAnswer } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { ILecture, IQuiz } from "../../../../types/CourseType";
import './QuestionContentUser.style.scss'
type toggleType = {
    type: "question" | "answer"
}
function QuestionContentUser() {
    const { id } = useParams();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const { currentCourse } = useAppSelector((state: RootState) => state.courses);
    const [answerText, setAnswerText] = useState<string>("");
    const [toggle, setToggle] = useState<toggleType>({ type: "question" })
    const [selection, setSelection] = useState<string>("ALL")
    const [questions, setQuestions] = useState<QuestionLectureType[]>([]);
    const [questionActive, setQuestionActive] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);
    const [openAnswer, setOpenAnswer] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [answerActive, setAnswerActive] = useState<number>();
    const [form] = Form.useForm();
    const [formAnswer] = Form.useForm();


    const handleOkAnswer = () => {
        formAnswer.submit()
    };
    const handleCancelAnswer = () => {
        setOpenAnswer(false);
        formAnswer.resetFields();
    };


    const addAnswerToQuestion = (questionId: number | undefined, newAnswer: AnswerLectureType) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? { ...question, answers: [...question.answers, newAnswer] }
                    : question
            )
        );
    };


    const onFinishAnswer = async (values: AnswerLecturePostType) => {
        if (questionActive) {
            const newValues: AnswerLecturePostType = {
                ...values, questionLectureId: questionActive
            }
            if (values.id) {
                const resUpdate = await updateUserAnswerLecture(newValues, values.id)
                if (resUpdate.status == 200) {
                    const newAnswer = resUpdate.data as AnswerLectureType
                    modifyAnswerInQuestion(questionActive, values.id, newAnswer);
                    alert("succcess")
                    setOpenAnswer(false);
                }
            }
        }

    }

    const getCurrentQuestionActive = (): QuestionLectureType => {
        const question = questions.find((q) => q.id === questionActive);
        if (!question) {
            throw new Error('Active question not found');
        }
        return question;
    };




    const fetchQuestionLecturesByCourse = async () => {

        if (currentCourse) {
            const res = await getByCourse(currentCourse.id)

            if (res.status == 200) {
                const data = res.data as QuestionLectureType[]
                setQuestions(data)
            }
        }
    }

    const fetchQuestionLecturesBySection = async () => {

        if (selection) {
            const secId = parseInt(selection)
            const res = await getBySection(secId);

            if (res.status == 200) {
                const data = res.data as QuestionLectureType[]
                setQuestions(data)
            }
        }
    }

    const modifyAnswerInQuestion = (
        questionId: number,
        answerId: number,
        updatedAnswerData: Partial<AnswerLectureType>
    ) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer) =>
                            answer.id === answerId && answer.user.role !== "ROLE_STUDENT"
                                ? { ...answer, ...updatedAnswerData }
                                : answer
                        ),
                    }
                    : question
            )
        );
    };


    const deleteAnswer = (
        sectionId: number | undefined,
        answerId: number
    ) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.lecture.sectionId === sectionId // Check sectionId
                    ? {
                        ...question,
                        answers: question.answers.filter(
                            (answer) =>
                                answer.id !== answerId || answer.user.role === "ROLE_STUDENT"
                        ), // Delete if role != "ROLE_STUDENT"
                    }
                    : question
            )
        );
    };





    const handleAddAnswer = async () => {
        alert("clicked")
        const values: AnswerLecturePostType = {
            content: answerText,
            questionLectureId: questionActive ? questionActive : 0
        }



        if (auth) {
            if (auth.user.role != "ROLE_STUDENT") {
                const res = await createUserAnswerLecture(values);
                console.log(res);
                console.log(values);


                if (res.status == 200) {
                    const data = res.data as AnswerLectureType
                    addAnswerToQuestion(questionActive, data)
                    setAnswerText("");
                }
            }
        }
    }



    const handleDeleteAnswer = async (id: number) => {
        try {
            const resSave = await deleteUserAnswerLecture(id);
            if (resSave.status === 204) {
                deleteAnswer(questionActive, id)
                alert("Delete successful");
            }

        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message)
            }
        }
    }

    const getCurrenCurriculum = (sectionId: number, curriculumId: number): (ILecture | IQuiz | undefined) => {
        if (currentCourse) {

            const section = currentCourse.sections.find(sec => sec.id === sectionId);
            if (section) {
                return section.curriculums.find(cur => cur.id === curriculumId && cur.type == "lecture");
            }
        }
        return undefined;
    }




    const handleEditAnswer = async (ans: AnswerLectureType) => {
        setOpenAnswer(true)
        if (ans) {
            formAnswer.setFieldsValue({
                id: ans.id,
                content: ans.content
            })
        }
    }
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchCourseById(id));
        if (selection == "ALL") {
            fetchQuestionLecturesByCourse();
        } else {
            fetchQuestionLecturesBySection();
        }

    }, [id, selection])


    return <div className="question-content-user-container">
        {toggle.type == "question" &&
            <div className="question-lecture-top">
                <div className="question-lecture-filter">
                    <span>Bộ lọc:</span>
                    <Select
                        style={{ width: "250px", height: "100%" }}
                        value={selection}
                        onChange={(value) => {
                            setSelection(value);
                        }}
                    >
                        <Select.Option value="ALL">Tất cả các bài giảng</Select.Option>
                        {currentCourse && currentCourse.sections && currentCourse.sections.length > 0 &&
                            currentCourse.sections.map((sec, index) => <Select.Option value={sec.id} key={`section-select-question-${sec.id}`}>Chương {index + 1}: {sec.title}</Select.Option>)}
                    </Select>
                </div>

            </div>
        }
        <div className="question-lecture-wrapper">
            {toggle.type == "question" ? <><span className="question-lecture-header">Các câu hỏi nổi bật trong khóa học này</span>
                {questions && questions.length > 0 && questions.map((question) => {
                    return <div className="question-lecture-item" key={`question-lecture-item-${question.id}`}>
                        <div className="question-lecture-left">
                            <img className="question-lecture" src={question.student.photo} alt="student-picture" />
                        </div>
                        <div className="question-lecture-middle">
                            <h3 className="question-lecture-title">{question.title}</h3>
                            <div className="question-lecture-description">{question.description}</div>
                            <div className="question-lecture-time">
                                <span>{question.student.email}</span>
                                <span>Bài giảng số {getCurrenCurriculum(question.lecture.sectionId, question.lecture.id)?.index}</span>
                                <span>{question.createdAt}</span>
                            </div>
                        </div>
                        <div className="question-lecture-right" >
                            <div className="question-lecture-view-answer" onClick={() => {
                                setToggle({ type: "answer" })
                                setQuestionActive(question.id)
                            }}>
                                <span>{question.answers.length}</span>
                                <MdOutlineQuestionAnswer className="question-lecture-icon" />
                            </div>
                        </div>
                    </div>
                })}
            </> : <>
                <Button className="question-lecture-active-btn" onClick={() => {
                    setToggle({ type: "question" })
                }}>Quay lại câu hỏi</Button>
                <div className="question-lecture-active-item" key={`question-lecture-item-${getCurrentQuestionActive().id}`}>
                    <div className="question-lecture-active-left">
                        <img className="question-lecture" src={getCurrentQuestionActive().student.photo} alt="student-picture" />
                    </div>
                    <div className="question-lecture-active-middle">
                        <h3 className="question-lecture-active-title">{getCurrentQuestionActive().title}</h3>
                        <div className="question-lecture-active-description">{getCurrentQuestionActive().description}</div>
                        <div className="question-lecture-active-time">
                            <span>Bài giảng số {getCurrenCurriculum(getCurrentQuestionActive().lecture.sectionId, getCurrentQuestionActive().lecture.id)?.index}</span>
                            <span>{getCurrentQuestionActive().createdAt}</span>
                        </div>
                    </div>
                </div>
                <span className="answer-lecture-length">{getCurrentQuestionActive().answers.length} hồi đáp</span>
                <div className="answer-lecture-wrapper">
                    {getCurrentQuestionActive().answers && getCurrentQuestionActive().answers.map((ans) =>
                        <div className="answer-lecture-item" key={`answer-lecture-${ans.id}`}>
                            <div className="answer-lecture-left">
                                <img className="answer-lecture" src={ans.user.photo} alt="student-picture" />
                            </div>
                            <div className="answer-lecture-middle">
                                <span className="answer-lecture-email">{ans.user.email}</span>
                                <span className="answer-lecture-content">{ans?.content}</span>
                                <span>{ans.createdAt}</span>
                            </div>
                            <div className="answer-lecture-right" >
                                {auth?.user.role !== "ROLE_STUDENT" && auth?.user.email == ans.user.email &&
                                    <>
                                        <MdOutlineEdit className="answer-lecture-edit-icon" onClick={() => handleEditAnswer(ans)} />
                                        <Modal
                                            title="Câu trả lời"
                                            open={openAnswer}
                                            onOk={handleOkAnswer}
                                            onCancel={handleCancelAnswer}
                                        >
                                            <Form layout="vertical" onFinish={onFinishAnswer} form={formAnswer} >
                                                <Form.Item
                                                    name="id"
                                                    style={{ display: "none" }}
                                                >
                                                    <Input type='hidden' />
                                                </Form.Item>
                                                <Row gutter={24}>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            name="content"
                                                            label="Viết phản hồi của bạn"
                                                            rules={[{ required: true, }]}
                                                        >
                                                            <Input placeholder="Ví dụ: Vì sao lại dùng hàm này?" />
                                                        </Form.Item>
                                                    </Col>

                                                </Row>

                                            </Form>
                                        </Modal>
                                        <Popconfirm
                                            title="Xóa câu trả lời này?"
                                            description="Bạn có chắc chắn xóa câu trả lời này?"
                                            okText="Có"
                                            cancelText="Không"
                                            onConfirm={() => handleDeleteAnswer(ans.id)}
                                        >
                                            <CiTrash style={{ fontSize: "20px", cursor: "pointer" }}

                                            />
                                        </Popconfirm>
                                    </>}
                            </div>
                        </div>
                    )}

                    <div className="answer-lecture-form-add">
                        <Input className="answer-lecture-input" value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Viết phản hồi của bạn" />
                        <Button className="answer-lecture-btn" onClick={handleAddAnswer}>Trả lời</Button>
                    </div>
                </div>
            </>}
        </div>
    </div>
}

export default QuestionContentUser;