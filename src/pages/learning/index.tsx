import { Link, useParams } from 'react-router-dom'
import './index.style.scss'
import { PiNote } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from 'react';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Button, Drawer, Progress, Select } from 'antd';
import SectionLearning from '../../components/section-learning';
import { ICurriculum, ILecture, IQuiz } from '../../types/CourseType';
import AnswerLearning from '../../components/answer-learning';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { LearningSelection, LearningWatchingSecond, fetchCourseBySlug, updateSelection, updateWatchingSecond } from '../../redux/slices/LearningSlice';
import { LearningLecturePost } from '../../types/learning/LearningLectureType';
import { createLearningLecture } from '../../services/LearningLectureService';
import { LearningQuizPost } from '../../types/learning/LearningQuizType';
import { createLearningQuiz } from '../../services/LearningQuizService';
import { CurriculumType } from '../../components/curriculum/CurriculumType';
import DrawerLearning from '../../components/drawer';
import { convertSecondToMinute } from '../../utils/Format';
import { NoteType } from '../../types/NoteType';
import { getNotesByCourseId, getNotesBySectionId } from '../../services/NoteService';
import NoteComponent from '../../components/note';
function Learning() {
    const { slug } = useParams();
    const [open, setOpen] = useState<boolean>(false);
    const [openViewNote, setOpenViewNote] = useState<boolean>(false);
    const [notes, setNotes] = useState<NoteType[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { learning, isLoading } = useAppSelector((state: RootState) => state.learning);
    const dispatch = useAppDispatch();
    const [selectingAnswer, setSelectingAnswer] = useState<number>(-1);
    const [selectingQuestion, setSelectingQuestion] = useState<number>(0);
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [watchingSecond, setWatchingSecond] = useState<number>(0);
    const [selectionFetchNote, setSelectFetchNote] = useState<string>("section");

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
            const percentage = (getLectureFinishedCount() / total) * 100;
            return Math.floor(percentage);
        }
        return 0;
    }

    const handleAnswer = () => {
        setIsAnswer(true);
    }

    const isFirstCurriculum = (): boolean => {
        if (learning) {
            if (learning.course.sections.length === 0) {
                return true;
            }
            for (let indexSection = 0; indexSection < learning.course.sections.length; indexSection++) {
                const sec = learning.course.sections[indexSection];
                for (let indexCur = 0; indexCur < sec.curriculums.length; indexCur++) {
                    const cur = sec.curriculums[indexCur];
                    if (indexSection === 0 && indexCur === 0 && cur.id === learning.curriculumId && cur.type == learning.type) {
                        // console.log("true");
                        // console.log(indexCur);
                        // console.log(sec.curriculums);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const isLastCurriculum = (): boolean => {
        if (learning) {
            if (learning.course.sections.length === 0) {
                return true;
            }

            const totalSectionCount = learning.course.sections.length;

            for (let indexSection = 0; indexSection < totalSectionCount; indexSection++) {
                const sec = learning.course.sections[indexSection];
                const totalCurCount = sec.curriculums.length;

                for (let indexCur = 0; indexCur < totalCurCount; indexCur++) {
                    const cur = sec.curriculums[indexCur];
                    if (indexSection === totalSectionCount - 1 && cur.id === learning.curriculumId && indexCur === totalCurCount - 1) {
                        console.log("true");
                        return true;
                    }
                }
            }
        }

        return false;
    }

    const handleUpdateSelection = async (type: "prev" | "next") => {
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
                                updateAccessCurriculum(cur);
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
                                updateAccessCurriculum(cur);
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
                                updateAccessCurriculum(cur);
                                return;
                            } else if (cur.id == learning.curriculumId && indexCur == 0) {
                                console.log("cannt prev");
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
                                console.log(indexCur, curCountOfSection);
                                console.log(nextCur);

                                dispatch(updateSelection(selection))
                                updateAccessCurriculum(cur);
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
                                updateAccessCurriculum(cur);
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
                                updateAccessCurriculum(cur);
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

    const updateAccessCurriculum = async (cur: ILecture | IQuiz) => {
        if (cur) {
            if (cur.type == "lecture") {
                console.log(watchingSecond);
                const learningLecturePost: LearningLecturePost = {
                    lectureId: cur.id,
                    watchingSecond: cur.watchingSecond,
                    finished: cur.finished
                }
                const res = await createLearningLecture(learningLecturePost);
                if (res.status == 204) {
                    console.log("updated");

                    if (learning) {
                        const learningWatching: LearningWatchingSecond = {
                            sectionId: learning.sectionId,
                            curriculumId: learning.curriculumId,
                            watchingSecond: watchingSecond
                        }
                        dispatch(updateWatchingSecond(learningWatching));
                    }
                }
            } else {
                const learningQuizPost: LearningQuizPost = {
                    quizId: cur.id,
                    finished: cur.finished
                }
                const res = await createLearningQuiz(learningQuizPost);
                if (res.status == 204) {
                    console.log("updated");
                }
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

    const fetchNoteBySection = async (sectionId: number) => {
        const res = await getNotesBySectionId(sectionId);
        if (res.status == 200) {
            const data = res.data as NoteType[]
            setNotes(data)
        }
    }

    const onClose = () => {
        setOpen(false);
    };
    const onCloseViewNote = () => {
        setOpenViewNote(false);
    };
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
            if (learning?.sectionId) {
                const secId = learning.sectionId;
                fetchNoteBySection(secId);
            }
        };
    }, [learning])

    const handleChange = async (value: string) => {
        console.log(`selected ${value}`);
        setSelectFetchNote(value)
        if (value == "course") {
            const res = await getNotesByCourseId(learning?.course.id);
            if (res.status == 200) {
                const data = res.data as NoteType[]
                setNotes(data)
            }
        } else if (value == "section") {
            const res = await getNotesBySectionId(learning?.sectionId);
            if (res.status == 200) {
                const data = res.data as NoteType[]
                setNotes(data)
            }
        }
    };

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
                <div className="learning-top-right">
                    <div className="learning-top-tracking">
                        <Progress className='learning-progress' type="circle" percent={getPecentFinished()} size={100} />
                        <span>{getLectureFinishedCount()}/{learning?.course.totalLectureCourse} bài học</span>
                    </div>
                    <div className="learning-top-note" onClick={() => setOpenViewNote(true)}>
                        <PiNote />
                        <span>Ghi chú</span>
                    </div>
                </div>
            </div>
            <div className="learning-wrapper">
                <div className="learning-left">
                    {open == true && <DrawerLearning setNotes={setNotes} setOpen={setOpen} second={watchingSecond} lectureId={currentCurriculum?.id} />}
                    {learning?.type == "lecture" && <> <video ref={videoRef} width={"100%"} height={500} controls className='learning-video' key={currentCurriculum?.type == "lecture" ? `${currentCurriculum.videoId}-${currentCurriculum.id}` : ""}>
                        <source src={currentCurriculum?.type == "lecture" ? currentCurriculum.videoId : ""} type='video/mp4' />
                    </video>
                        <div className="learning-curriculum-info">
                            <div className="learning-curriculum-info-top">
                                <h2 className='learning-curriculum-title'>{currentCurriculum?.title}</h2>
                                <Button onClick={() => setOpen(true)}>
                                    <FaPlus />
                                    <span>Thêm ghi chú tại {convertSecondToMinute(watchingSecond)}</span>
                                </Button>
                            </div>
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
                <Button disabled={isFirstCurriculum()} className='btn-learning-prev' onClick={() => handleUpdateSelection("prev")}>
                    <RxCaretLeft className='learning-bottom-caret' />
                    <span>BÀI TRƯỚC</span>
                </Button>
                <Button disabled={isLastCurriculum()} className='btn-learning-next' onClick={() => handleUpdateSelection("next")}>
                    <span>BÀI TIẾP THEO</span>
                    <RxCaretRight className='learning-bottom-caret' />
                </Button>
            </div>
            <Drawer
                placement={"right"}
                width={"50%"}
                onClose={onCloseViewNote}
                open={openViewNote}
                rootClassName='drawer-learning-note'

            >
                <div className="learning-note-view-container">
                    <div className="learning-note-view-header">
                        <h2>Ghi chú của tôi</h2>
                        <div className="learning-note-selection">
                            <Select onChange={handleChange} value={selectionFetchNote} className='learning-note-fetch'>
                                <Select.Option value="section">Trong chương hiện tại</Select.Option>
                                <Select.Option value="course">Trong tất cả các chương</Select.Option>

                            </Select>
                            <Select onChange={handleChange} value={"sample"}>
                                <Select.Option value="sample">Sample</Select.Option>
                            </Select>
                        </div>
                    </div>

                    <div className="learning-note-wrapper">
                        {notes && notes.length > 0 && notes.map((note) => {
                            return <NoteComponent note={note} key={`note-${note.id}`} setNotes={setNotes} notes={notes} />
                        })}
                    </div>

                </div>
            </Drawer>
        </div>
    )
}

export default Learning