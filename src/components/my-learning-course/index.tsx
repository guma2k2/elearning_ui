import { Modal, Progress, Rate } from "antd";
import './MyLearningCourse.style.scss'
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
function MyLearningCourse() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleOk = () => {
        console.log("cancel");

        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const hanldeHoverChange = (value: number) => {
        console.log(value);

    }
    return <div className="my-learning-course-container">
        <img src="https://img-b.udemycdn.com/course/240x135/4625262_4a39.jpg" alt="course-image" className="my-learning-course-image" />
        <h3 className="my-learning-course-title">Thực Hành Bài Test Fresher React Frontend</h3>
        <div className="my-learning-course-instructor">Hỏi Dân IT với Eric .</div>
        <Progress percent={100} showInfo={false} className="my-learning-course-progress" />
        <div className="my-learning-course-bottom">
            <div className="my-learning-course-progress-text">Hoàn thành 100%</div>
            <div className="my-learning-course-rating" onClick={showModal}>
                <Rate disabled defaultValue={2} className="my-learning-course-rating-icon" />
                <div className="my-learning-course-rating-text">Xep hang cua ban</div>

            </div>
        </div>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} rootClassName="review-modal">
            <h1>Vì sao bạn xếp hạng ở mức này?</h1>
            <Rate allowHalf defaultValue={5} onHoverChange={hanldeHoverChange} />
            <TextArea rows={4} />
        </Modal>
    </div>;
}

export default MyLearningCourse;