import { useParams } from 'react-router-dom'
import './index.style.scss'
import { getCourseBySlug } from '../../services/CourseService';
import { LearningType } from '../../types/LearningType';
import { useEffect, useState } from 'react';
import UdemyLogo from "../../assets/logo-udemy.svg"
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Button, Progress } from 'antd';
import SectionLearning from '../../components/section-learning';
import { ILecture, IQuiz } from '../../types/CourseType';
import AnswerLearning from '../../components/answer-learning';
function Learning() {
    const { slug } = useParams();
    const [learning, setLearning] = useState<LearningType>();
    const [selection, setSelection] = useState<ILecture | IQuiz>();

    const [selectingAnswer, setSelectingAnswer] = useState<number>(-1);
    const [isAnswer, setIsAnswer] = useState<boolean>(false);


    const handleAnswer = () => {
        setIsAnswer(true);
    }
    useEffect(() => {
        const fetchCourseById = async () => {
            const res = await getCourseBySlug(slug);
            const currentCourse = res.data as LearningType
            let start: number = 1
            currentCourse.course.sections.forEach((section) => {
                section.curriculums.forEach((curriclum) => {
                    curriclum.index = start++;
                })
            })
            // clone data
            currentCourse.type = "quiz";
            currentCourse.curriculumId = 1;
            currentCourse.sectionId = 1;

            currentCourse.course.sections.forEach((sec) => {
                if (sec.id = currentCourse.sectionId) {
                    sec.curriculums.forEach((cur) => {
                        if (cur.id == currentCourse.curriculumId) {
                            setSelection(cur);
                        }
                    })
                }
            })
            if (res.status === 200) {
                setLearning(currentCourse);
            }
        }
        fetchCourseById();

    }, [slug])

    return (
        <div className='learning-container'>
            <div className="learning-top">
                <div className="learning-top-title">
                    <div className="learning-top-icon">
                        <RxCaretLeft className='learning-top-caret' />
                    </div>
                    <img src={UdemyLogo} alt="udemylogo" />
                    <span>Làm việc với Terminal & Ubuntu</span>
                </div>
                <div className="learning-top-tracking">
                    <Progress className='learning-progress' type="circle" percent={99} size={100} />
                    <span>5/40 bài học</span>
                </div>
            </div>
            <div className="learning-wrapper">
                <div className="learning-left">
                    {learning?.type == "lecture" && <>    <video width={"100%"} height={500} controls className='learning-video'>
                        <source src='https://res.cloudinary.com/di6h4mtfa/video/upload/v1708086787/40eae44e-10cc-4750-b7fa-b5df6561d9a8.mp4' type='video/mp4' />
                    </video>
                        <div className="learning-curriculum-info">
                            <h2 className='learning-curriculum-title'>Lời khuyên trước khóa học</h2>
                            <div className='learning-curriculum-time'>Cập nhật tháng 11 năm 2022</div>
                            <div className='learning-curriculum-footer'>Made with  Powered by F8</div>
                        </div>
                    </>}
                    {learning?.type == "quiz" && <div className='learning-quiz-container'>
                        <h1 className="learning-quiz-title">Ôn tập toán tử so sánh</h1>
                        <div className="learning-quiz-updated-time">Cập nhật tháng 6 năm 2022</div>
                        <div className="learning-quiz-question-content">
                            {selection && selection.type == "quiz" && selection.questions && <div dangerouslySetInnerHTML={{ __html: selection.questions[0].title }}></div>}
                        </div>
                        <p className="learning-quiz-select-title">Chọn câu trả lời đúng.</p>
                        <div className="learning-quiz-answer-container">
                            {selection && selection.type == "quiz" && selection.questions && selection.questions[0].answers.map((ans) => {
                                return <AnswerLearning setIsAnswer={setIsAnswer} selectingAnswer={selectingAnswer} isAnswer={isAnswer} answer={ans} key={`ans-learning-${ans.id}`} setSelectingAnswer={setSelectingAnswer} />;
                            })}
                        </div>

                        <div className="learning-quiz-btn-answer">
                            <Button disabled={selectingAnswer == -1} onClick={handleAnswer} className='btn-answer'>TRẢ LỜI</Button>
                        </div>
                        {(isAnswer == true && selection && selection.type == "quiz" && selection.questions) && selection.questions[0].answers[selectingAnswer].reason
                            && <div className='learning-quiz-explain'>
                                <h2 className="learning-quiz-explain-header">Giải thích</h2>
                                <div className='learning-quiz-explain' dangerouslySetInnerHTML={{ __html: selection.questions[0].answers[selectingAnswer].reason }}></div>
                            </div>}
                    </div>}
                </div>
                <div className="learning-right">
                    <div className="learning-right-header">Nội dung khóa học</div>
                    <div className="learning-right-container">
                        {learning?.course && learning.course.sections.map((sec, index) => {
                            return <SectionLearning section={sec} index={index} key={`sec-${sec.id}`} />
                        })}
                    </div>
                </div>
            </div>
            <div className="learning-bottom">
                <Button className='btn-learning-prev'>
                    <RxCaretLeft className='learning-bottom-caret' />
                    <span>BÀI TRƯỚC</span>
                </Button>
                <Button className='btn-learning-next'>
                    <span>BÀI TIẾP THEO</span>
                    <RxCaretRight className='learning-bottom-caret' />
                </Button>
            </div>
        </div>
    )
}

export default Learning