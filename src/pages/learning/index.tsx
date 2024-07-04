import { useParams } from 'react-router-dom'
import './index.style.scss'
import { getCourseBySlug } from '../../services/CourseService';
import { LearningType } from '../../types/LearningType';
import { useEffect, useState } from 'react';
import UdemyLogo from "../../assets/logo-udemy.svg"
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Button, Progress } from 'antd';
import SectionLearning from '../../components/section-learning';
import { LearningState } from '../../redux/slices/LearningSlice';
function Learning() {
    const { slug } = useParams();
    const [learning, setLearning] = useState<LearningType>();
    const [selection, setSelection] = useState<LearningState>();
    console.log(slug);
    useEffect(() => {
        const fetchCourseById = async () => {
            const res = await getCourseBySlug(slug);
            const currentCourse = res.data as LearningType
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
                </div>
                <div className="learning-right">
                    <div className="learning-right-header">Nội dung khóa học</div>
                    <div className="learning-right-container">
                        {learning?.course && learning.course.sections.map((sec, index) => {
                            return <SectionLearning section={sec} index={index} key={index} />
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