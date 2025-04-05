import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select } from "antd";
import { useEffect, useState } from "react";
import './QuestionContent.style.scss'
import { MdOutlineEdit, MdOutlineQuestionAnswer } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";
import { ILecture, IQuiz } from "../../types/CourseType";
import { createQuestionLecture, deleteQuestionLecture, getByCourse, getByLectureId, updateQuestionLecture } from "../../services/QuestionLectureService";
import { AnswerLecturePostType, AnswerLectureType, QuestionLecturePostType, QuestionLectureType } from "../../types/QuestionLectureType";
import { AxiosError } from "axios";
import { ErrorType } from "../../types/ErrorType";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { createStudentAnswerLecture, deleteStudentAnswerLecture, updateStudentAnswerLecture } from "../../services/StudentAnswerService";
import { CiTrash } from "react-icons/ci";
type prop = {
    curriculum: ILecture
}

type toggleType = {
    type: "question" | "answer"
}
function QuestionContent(props: prop) {
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const { learning } = useAppSelector((state: RootState) => state.learning)

    const [answerText, setAnswerText] = useState<string>("");
    const [toggle, setToggle] = useState<toggleType>({ type: "question" })
    const { curriculum } = props;
    const [selection, setSelection] = useState<string>("LECTURE")
    const [questions, setQuestions] = useState<QuestionLectureType[]>([]);
    const [questionActive, setQuestionActive] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);
    const [openAnswer, setOpenAnswer] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [answerActive, setAnswerActive] = useState<number>();
    const [form] = Form.useForm();
    const [formAnswer] = Form.useForm();

    const addDataToFirstItem = (newItem: QuestionLectureType) => {
        setQuestions((prevQuestions) => [newItem, ...prevQuestions]);
    };

    const modifyQuestionById = (id: number, updatedData: Partial<QuestionLectureType>) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === id ? { ...question, ...updatedData } : question
            )
        );
    };


    const getCurrenCurriculum = (sectionId: number, curriculumId: number): (ILecture | IQuiz | undefined) => {
        if (learning) {

            const section = learning.course.sections.find(sec => sec.id === sectionId);
            if (section) {
                return section.curriculums.find(cur => cur.id === curriculumId && cur.type == "lecture");
            }
        }
        return undefined;
    }


    const showModalAnswer = () => {
        setOpenAnswer(true)
    }

    const handleOkAnswer = () => {
        formAnswer.submit()
    };
    const handleCancelAnswer = () => {
        setOpenAnswer(false);
        formAnswer.resetFields();
    };

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        form.submit()
    };
    const handleCancel = () => {
        setOpen(false);
        form.resetFields();
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
                const resUpdate = await updateStudentAnswerLecture(newValues, values.id)
                if (resUpdate.status == 200) {
                    const newAnswer = resUpdate.data as AnswerLectureType
                    modifyAnswerInQuestion(questionActive, values.id, newAnswer);
                    alert("succcess")
                    setOpenAnswer(false);
                }
            }
        }

    }

    const onFinish = async (values: QuestionLecturePostType) => {
        const title = values.title;
        const newValues: QuestionLecturePostType = {
            ...values, title: title.trim(), lectureId: curriculum.id ? curriculum.id : 0
        }


        // setPending(true);
        const type = values.id ? "update" : "create";


        if (type === "create") {
            try {
                const resSave = await createQuestionLecture(newValues);
                if (resSave.status === 200) {

                    const data = resSave.data as QuestionLectureType

                    const newData: QuestionLectureType = {
                        ...data, answers: []
                    }
                    addDataToFirstItem(newData);
                    form.resetFields();
                    setOpen(false);
                    alert("Add successful");
                }

            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    // setPending(false)
                    alert(message)
                }
            }

        } else {
            try {
                const questionId = values.id;
                const resUpdate = await updateQuestionLecture(newValues, questionId);
                if (resUpdate.status === 200) {

                    const resData = resUpdate.data as QuestionLectureType
                    modifyQuestionById(resData.id, resData)
                    form.resetFields();
                    setOpen(false)
                    alert("Update successful");
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    // setPending(false)
                    alert(message)

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

    const fetchQuestionLectures = async () => {
        console.log(curriculum);

        const res = await getByLectureId(curriculum.id)
        console.log(res);

        if (res.status == 200) {
            const data = res.data as QuestionLectureType[]
            setQuestions(data)
        }
    }


    const fetchQuestionLecturesByCourse = async () => {
        console.log(curriculum);

        if (learning) {
            const res = await getByCourse(learning.course.id)

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
                            answer.id === answerId && answer.user.role == "ROLE_STUDENT"
                                ? { ...answer, ...updatedAnswerData }
                                : answer
                        ),
                    }
                    : question
            )
        );
    };


    const deleteStudentAnswer = (questionId: number | undefined, answerId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.filter(
                            (answer) =>
                                answer.id !== answerId || answer.user.role !== "ROLE_STUDENT"
                        ),
                    }
                    : question
            )
        );
    };




    const handleAddAnswer = async () => {
        const values: AnswerLecturePostType = {
            content: answerText,
            questionLectureId: questionActive ? questionActive : 0
        }



        if (auth) {
            if (auth.user.role == "ROLE_STUDENT") {
                const res = await createStudentAnswerLecture(values);
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

    const deleteQuestionById = (id: number) => {
        setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== id));
    };

    const handleDeleteQuestion = async (questionId: number) => {
        try {
            const resSave = await deleteQuestionLecture(questionId);
            if (resSave.status === 204) {
                deleteQuestionById(questionId)
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


    const handleDeleteAnswer = async (id: number) => {
        try {
            const resSave = await deleteStudentAnswerLecture(id);
            if (resSave.status === 204) {
                deleteStudentAnswer(questionActive, id)
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


    const handleEditQuestion = async (questionId: number) => {
        setOpen(true);
        const question = questions.find((q) => q.id === questionId);
        if (!question) {
            throw new Error('Active question not found');
        }


        if (question) {
            form.setFieldsValue({
                id: question.id,
                title: question.title,
                description: question.description
            })
        }
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

    useEffect(() => {
        if (selection == "LECTURE") {
            fetchQuestionLectures();
        } else if (selection == "ALL") {
            fetchQuestionLecturesByCourse();
        }

    }, [curriculum, selection])

    // console.log(getCurrenCurriculum(getCurrentQuestionActive().lecture.sectionId, getCurrentQuestionActive().lecture.id)?.index);

    return <div className="question-lecture-container">
        {toggle.type == "question" &&
            <div className="question-lecture-top">
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
                        <Select.Option value="LECTURE">Trong bài học này</Select.Option>
                    </Select>
                </div>
                <div className="question-lecture-create">
                    <Button onClick={showModal}>Tạo câu hỏi</Button>
                    <Modal
                        title="Câu hỏi"
                        open={open}
                        onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                    >
                        <Form layout="vertical" onFinish={onFinish} form={form} >
                            <Form.Item
                                name="id"
                                style={{ display: "none" }}
                            >
                                <Input type='hidden' />
                            </Form.Item>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="title"
                                        label="Tiêu đề hoặc tóm tắt"
                                        rules={[{ required: true, }]}
                                    >
                                        <Input placeholder="Ví dụ: Vì sao lại dùng hàm này?" />
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="description"
                                        label="Mô tả"
                                        rules={[{ required: true, }]}
                                    >
                                        <TextArea placeholder="Nhập mã" />
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>
                    </Modal>
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
                            {auth?.user.role === "ROLE_STUDENT" && auth.user.email == question.student.email &&
                                <div className="question-lecture-edit">
                                    <MdOutlineEdit className="question-lecture-edit-icon" onClick={() => handleEditQuestion(question.id)} />
                                    <Popconfirm
                                        title="Xóa câu hỏi này?"
                                        description="Bạn có chắc chắn xóa câu hỏi này?"
                                        okText="Có"
                                        cancelText="Không"
                                        onConfirm={() => handleDeleteQuestion(question.id)}
                                    >
                                        <CiTrash style={{ fontSize: "20px", cursor: "pointer" }}

                                        />
                                    </Popconfirm>
                                </div>}
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
                                {auth?.user.role === "ROLE_STUDENT" && auth.user.email == ans.user.email &&
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

export default QuestionContent;