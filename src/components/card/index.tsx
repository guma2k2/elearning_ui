import { Link } from 'react-router-dom';
import { CourseType } from '../../types/CourseType'
import './Card.style.scss'
import { Rate } from 'antd';
import { useRef } from 'react';
import { Tooltip, TooltipRefProps } from 'react-tooltip';

import Tick from "../../assets/tick.png"
type Props = {
    course: CourseType
}
function Card(props: Props) {
    const { course } = props;
    return (
        <Link className='card-container' to={"/course/:id"} >
            <img data-tooltip-id="my-tooltip" className='course-image' src={course.imageURL} alt="course image" />
            <h3>{course.title}</h3>
            <span className='course-instructor'>in28Minutes Official</span>
            <span className='course-rating'>
                <span className='average-rating'>4.8</span>
                <Rate className='rating' allowHalf disabled defaultValue={4.5} />
                <span className='count-rating'>22</span>
            </span>
            <span className='course-price'>299 000 d</span>
            <Tooltip
                place='bottom-end'
                id="my-tooltip"
                render={({ }) => (
                    <div className='tooltip-container'>
                        <div className="header">Build Reactive MicroServices using Spring WebFlux/SpringBoot</div>
                        <div className="description">
                            <div className="updated-date">Đã cập nhật tháng 3 năm 2024</div>
                            <div className="sub-desc">
                                <div className="total-hours">Tổng số 7 giờ</div>
                                <div className="level">Tất cả trình độ</div>
                            </div>
                            <div className="objective-container">
                                <h2 className="headline">
                                    Learn to write fast performing Asynchronous and NonBlocking code using the Reactive Programming principles and Reactor.
                                </h2>
                                <div className="objectives">
                                    <div className="objective">
                                        <img src={Tick} alt="tick-icon" />
                                        <div className="content">What is Reactive Programming?</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button">Them vao gio hang</div>
                    </div>
                )}
            />
        </Link>

    )
}

export default Card