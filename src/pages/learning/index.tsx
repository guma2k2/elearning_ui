import { Link, useParams } from 'react-router-dom'
import './index.style.scss'
import { LearningType } from '../../types/LearningType';
import { useEffect, useState } from 'react';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Button, Progress } from 'antd';
import SectionLearning from '../../components/section-learning';
import { ILecture, IQuiz } from '../../types/CourseType';
import AnswerLearning from '../../components/answer-learning';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchCourseBySlug } from '../../redux/slices/LearningSlice';
function Learning() {
    const { slug } = useParams();
    const { learning, isLoading } = useAppSelector((state: RootState) => state.learning);
    const dispatch = useAppDispatch();
    const [selectingAnswer, setSelectingAnswer] = useState<number>(-1);
    const [isAnswer, setIsAnswer] = useState<boolean>(false);

    const getSelection = (): (ILecture | IQuiz | undefined) => {
        if (learning) {
            learning.course.sections.forEach((sec) => {
                if (sec.id == learning.sectionId) {
                    sec.curriculums.forEach((cur) => {
                        if (cur.id == learning.curriculumId) {
                            return cur;
                        }
                    })
                }
            })
        }
        return undefined;
    }
    const selection = getSelection();
    const getCurrenCurriculum = (): (ILecture | IQuiz | undefined) => {
        if (learning) {
            const curricumCurrentId = learning.curriculumId;
            const sectionCurrentId = learning.sectionId;

            console.log(curricumCurrentId);
            console.log(sectionCurrentId);

            const section = learning.course.sections.find(sec => sec.id === sectionCurrentId);
            if (section) {
                return section.curriculums.find(cur => cur.id === curricumCurrentId);
            }
        }
        return undefined;
    }
    const getLectureFinishedCount = (): number => {
        if (learning) {
            let count: number = 0;
            learning.course.sections.forEach((sec) => {
                sec.curriculums.forEach((cur) => {
                    if (cur.finished == true) {
                        count++;
                    }
                })
            })
            return count;
        }
        return 0;
    }

    const getPecentFinished = (): number => {
        if (learning) {
            const total = learning?.course.totalLectureCourse;
            return (getLectureFinishedCount() / total) * 100
        }
        return 0;
    }

    const handleAnswer = () => {
        setIsAnswer(true);
    }
    useEffect(() => {
        dispatch(fetchCourseBySlug(slug));

    }, [slug])

    console.log(getCurrenCurriculum());
    return (
        <div className='learning-container'>
            <div className="learning-top">
                <div className="learning-top-title">
                    <Link to={"/"} className="learning-top-icon">
                        <RxCaretLeft className='learning-top-caret' />
                    </Link>
                    <img src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png" alt="udemylogo" className='learning-udemy-logo' />
                    <span>{learning?.course.title}</span>
                </div>
                <div className="learning-top-tracking">
                    <Progress className='learning-progress' type="circle" percent={getPecentFinished()} size={100} />
                    <span>{getLectureFinishedCount()}/{learning?.course.totalLectureCourse} bài học</span>
                </div>
            </div>
            <div className="learning-wrapper">
                <div className="learning-left">
                    {learning?.type == "lecture" && <> <video width={"100%"} height={500} controls className='learning-video'>
                        <source src='https://res.cloudinary.com/di6h4mtfa/video/upload/v1708086787/40eae44e-10cc-4750-b7fa-b5df6561d9a8.mp4' type='video/mp4' />
                    </video>
                        <div className="learning-curriculum-info">
                            <h2 className='learning-curriculum-title'>{getCurrenCurriculum()?.title}</h2>
                            <div className='learning-curriculum-time'>Cập nhật {getCurrenCurriculum()?.updatedAt}</div>
                            <div className='learning-curriculum-footer'>Made with  Powered by F8</div>
                        </div>
                    </>}
                    {learning?.type == "quiz" && <div className='learning-quiz-container'>
                        <h1 className="learning-quiz-title">{getCurrenCurriculum()?.title}</h1>
                        <div className="learning-quiz-updated-time">Cập nhật {getCurrenCurriculum()?.updatedAt}</div>
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
                        {isAnswer && selection && selection.type === "quiz" && selection.questions &&
                            selection.questions[0].answers[selectingAnswer].reason && (
                                <div className="learning-quiz-explain">
                                    <h2 className="learning-quiz-explain-header">Giải thích</h2>
                                    <div
                                        className="learning-quiz-explain"
                                        dangerouslySetInnerHTML={{
                                            __html: selection.questions[0].answers[selectingAnswer].reason || "",
                                        }}
                                    ></div>
                                </div>
                            )}
                    </div>}
                </div>
                <div className="learning-right">
                    <div className="learning-right-header">Nội dung khóa học</div>
                    <div className="learning-right-container">
                        {learning?.course && learning.course.sections.map((sec, index) => {
                            return <SectionLearning section={sec} index={index} key={`sec-learning-${sec.id}`} />
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