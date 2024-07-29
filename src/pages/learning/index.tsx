import { Link, useParams } from 'react-router-dom'
import './index.style.scss'
import { LearningType } from '../../types/LearningType';
import { useEffect, useRef, useState } from 'react';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Button, Progress } from 'antd';
import SectionLearning from '../../components/section-learning';
import { ILecture, IQuiz } from '../../types/CourseType';
import AnswerLearning from '../../components/answer-learning';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { LearningSelection, LearningWatchingSecond, fetchCourseBySlug, updateSelection, updateWatchingSecond } from '../../redux/slices/LearningSlice';
function Learning() {
    const { slug } = useParams();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { learning, isLoading } = useAppSelector((state: RootState) => state.learning);
    const dispatch = useAppDispatch();
    const [selectingAnswer, setSelectingAnswer] = useState<number>(-1);
    const [selectingQuestion, setSelectingQuestion] = useState<number>(0);
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [watchingSecond, setWatchingSecond] = useState<number>(0);


    const getCurrenCurriculum = (): (ILecture | IQuiz | undefined) => {
        if (learning) {
            const curricumCurrentId = learning.curriculumId;
            const sectionCurrentId = learning.sectionId;

            const section = learning.course.sections.find(sec => sec.id === sectionCurrentId);
            if (section) {
                return section.curriculums.find(cur => cur.id === curricumCurrentId && cur.type == learning.type);
            }
        }
        return undefined;
    }
    const currentCurriculum = getCurrenCurriculum();
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

    const handleResetQuestion = () => {
        setSelectingQuestion(0);
        setIsAnswer(false);
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

    const handleUpdateSelection = (type: "prev" | "next") => {
        if (type == 'prev') {
            if (learning) {
                learning.course.sections.forEach((sec, indexSection) => {
                    sec.curriculums.forEach((cur, indexCur) => {
                        if (sec.id == learning.sectionId && indexSection > 0) {
                            if (cur.id == learning.curriculumId && indexCur > 0) {
                                const prevCur = learning.course.sections[indexSection].curriculums[indexCur - 1];
                                const selection: LearningSelection = {
                                    sectionId: sec.id,
                                    curriculumId: prevCur.id,
                                    type: prevCur.type
                                }
                                dispatch(updateSelection(selection))
                                return;
                            } else if (cur.id == learning.curriculumId && indexCur == 0) {
                                const curCountOfPrevSection = learning.course.sections[indexSection - 1].curriculums.length;
                                const prevSec = learning.course.sections[indexSection - 1]
                                const prevCur = learning.course.sections[indexSection - 1].curriculums[curCountOfPrevSection - 1];
                                const selection: LearningSelection = {
                                    sectionId: prevSec.id,
                                    curriculumId: prevCur.id,
                                    type: prevCur.type
                                }
                                dispatch(updateSelection(selection))
                                return;
                            }

                        } else if (sec.id == learning.sectionId && indexSection == 0) {
                            if (cur.id == learning.curriculumId && indexCur > 0) {
                                const prevCur = learning.course.sections[indexSection].curriculums[indexCur - 1];
                                const selection: LearningSelection = {
                                    sectionId: sec.id,
                                    curriculumId: prevCur.id,
                                    type: prevCur.type
                                }
                                dispatch(updateSelection(selection))
                                return;
                            } else if (cur.id == learning.curriculumId && indexCur == 0) {
                                return;
                            }
                        }
                    })
                })
            }
        } else if (type == "next") {
            if (learning) {
                const sectionCount = learning.course.sections.length;
                learning.course.sections.forEach((sec, indexSection) => {
                    sec.curriculums.forEach((cur, indexCur) => {
                        const curCountOfSection = learning.course.sections[indexSection].curriculums.length;
                        if (sec.id == learning.sectionId && indexSection < sectionCount - 1) {
                            if (cur.id == learning.curriculumId && indexCur < (curCountOfSection - 1)) {
                                const nextCur = learning.course.sections[indexSection].curriculums[indexCur + 1];
                                const selection: LearningSelection = {
                                    sectionId: sec.id,
                                    curriculumId: nextCur.id,
                                    type: nextCur.type
                                }
                                dispatch(updateSelection(selection))
                                return;
                            } else if (cur.id == learning.curriculumId && indexCur == (curCountOfSection - 1)) {
                                const nextSec = learning.course.sections[indexSection + 1];
                                const nextCur = learning.course.sections[indexSection + 1].curriculums[0];
                                const selection: LearningSelection = {
                                    sectionId: nextSec.id,
                                    curriculumId: nextCur.id,
                                    type: nextCur.type
                                }
                                dispatch(updateSelection(selection))
                                return;
                            }

                        } else if (sec.id == learning.sectionId && indexSection == (sectionCount - 1)) {
                            if (cur.id == learning.curriculumId && indexCur < (curCountOfSection - 1)) {
                                const nextCur = learning.course.sections[indexSection].curriculums[indexCur + 1];
                                const selection: LearningSelection = {
                                    sectionId: sec.id,
                                    curriculumId: nextCur.id,
                                    type: nextCur.type
                                }
                                dispatch(updateSelection(selection))
                                return;
                            } else if (cur.id == learning.curriculumId && indexCur < (curCountOfSection - 1)) {
                                return;
                            }
                        }
                    })
                })
            }
        }
    }

    const handleNextQuestion = () => {
        setSelectingQuestion((prev) => prev + 1);
        setIsAnswer(false);
    }

    useEffect(() => {
        dispatch(fetchCourseBySlug(slug));
        if (videoRef.current) {
            if (learning) {
                const watchingSecondCurrent = learning.secondWatched;
                if (watchingSecondCurrent) {
                    videoRef.current.currentTime = watchingSecondCurrent;
                }
            }
        }

    }, [slug])

    useEffect(() => {
        if (videoRef.current) {
            if (learning) {
                if (currentCurriculum) {
                    const watchingSecondOfCur = currentCurriculum.type == "lecture" ? currentCurriculum.watchingSecond : 0;
                    videoRef.current.currentTime = watchingSecondOfCur;
                }
            }
        }

        const handleTimeUpdate = () => {
            if (videoRef.current) {
                if (learning) {
                    if (learning.type == "lecture") {
                        setWatchingSecond(videoRef.current.currentTime)
                    }
                }
            }
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [learning])

    console.log(watchingSecond);


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
                    {learning?.type == "lecture" && <> <video ref={videoRef} width={"100%"} height={500} controls className='learning-video' key={currentCurriculum?.type == "lecture" ? `${currentCurriculum.videoId}-${currentCurriculum.id}` : ""}>
                        <source src={currentCurriculum?.type == "lecture" ? currentCurriculum.videoId : ""} type='video/mp4' />
                    </video>
                        <div className="learning-curriculum-info">
                            <h2 className='learning-curriculum-title'>{currentCurriculum?.title}</h2>
                            <div className='learning-curriculum-time'>Cập nhật {currentCurriculum?.updatedAt}</div>
                            <div className='learning-curriculum-footer'>Made with  Powered by F8</div>
                        </div>
                    </>}
                    {learning?.type == "quiz" && <div className='learning-quiz-container'>
                        <h1 className="learning-quiz-title">{getCurrenCurriculum()?.title}</h1>
                        <div className="learning-quiz-updated-time">Cập nhật {getCurrenCurriculum()?.updatedAt}</div>
                        <div className="learning-quiz-question-content">
                            {currentCurriculum && currentCurriculum.type == "quiz" && currentCurriculum.questions && currentCurriculum.questions.length > 0 &&
                                <span>Cau {selectingQuestion + 1}:</span>}
                            {currentCurriculum && currentCurriculum.type == "quiz" && currentCurriculum.questions && <div dangerouslySetInnerHTML={{ __html: currentCurriculum.questions[selectingQuestion].title }}></div>}
                        </div>
                        <p className="learning-quiz-select-title">Chọn câu trả lời đúng.</p>
                        <div className="learning-quiz-answer-container">
                            {currentCurriculum && currentCurriculum.type == "quiz" && currentCurriculum.questions && currentCurriculum.questions[selectingQuestion].answers.map((ans) => {
                                return <AnswerLearning setIsAnswer={setIsAnswer} selectingAnswer={selectingAnswer} isAnswer={isAnswer} answer={ans} key={`ans-learning-${ans.id}`} setSelectingAnswer={setSelectingAnswer} />;
                            })}
                        </div>

                        <div className="learning-quiz-btn-answer">
                            <Button disabled={selectingAnswer == -1} onClick={handleAnswer} className='btn-answer'>TRẢ LỜI</Button>
                            {currentCurriculum && currentCurriculum.type == "quiz" && currentCurriculum.questions && selectingQuestion < currentCurriculum.questions?.length - 1
                                && <Button onClick={handleNextQuestion} className='btn-next-question'>CAU TIEP THEO</Button>}

                            {currentCurriculum && currentCurriculum.type == "quiz" && currentCurriculum.questions && selectingQuestion == currentCurriculum.questions?.length - 1 && isAnswer == true
                                && <Button onClick={handleResetQuestion} className='btn-next-question'>Lam lai</Button>}
                        </div>
                        {isAnswer &&
                            currentCurriculum &&
                            currentCurriculum.type === "quiz" &&
                            currentCurriculum.questions &&
                            currentCurriculum.questions[selectingQuestion] &&
                            currentCurriculum.questions[selectingQuestion].answers &&
                            currentCurriculum.questions[selectingQuestion].answers[selectingAnswer] &&
                            currentCurriculum.questions[selectingQuestion].answers[selectingAnswer].reason && (
                                <div className="learning-quiz-explain">
                                    <h2 className="learning-quiz-explain-header">Giải thích</h2>
                                    <div
                                        className="learning-quiz-explain"
                                        dangerouslySetInnerHTML={{
                                            __html: currentCurriculum.questions[selectingQuestion].answers[selectingAnswer].reason || "",
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
                            return <SectionLearning watchingSecond={watchingSecond} section={sec} index={index} key={`sec-learning-${sec.id}`} />
                        })}
                    </div>
                </div>
            </div>
            <div className="learning-bottom">
                <Button className='btn-learning-prev' onClick={() => handleUpdateSelection("prev")}>
                    <RxCaretLeft className='learning-bottom-caret' />
                    <span>BÀI TRƯỚC</span>
                </Button>
                <Button className='btn-learning-next' onClick={() => handleUpdateSelection("next")}>
                    <span>BÀI TIẾP THEO</span>
                    <RxCaretRight className='learning-bottom-caret' />
                </Button>
            </div>
        </div>
    )
}

export default Learning