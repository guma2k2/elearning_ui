import { useParams } from "react-router-dom";
import './InstructorProfile.style.scss'
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/UserService";
import { UserProfile } from "../../types/UserType";
import Card from "../../components/card";
function InstructorProfile() {
    const { id } = useParams();
    const [instructor, setInstructor] = useState<UserProfile>();
    const fetchInstructorProfile = async (id: number) => {
        const res = await getUserProfile(id);
        console.log(res);
        if (res.status == 200) {
            const data = res.data as UserProfile;
            setInstructor(data);
        }
    }
    useEffect(() => {
        if (id) {
            const idNum = parseInt(id);
            fetchInstructorProfile(idNum);
        }

    }, [id])

    return <div className="instructor-profile-container">
        <div className="instructor-profile-left">
            <div className="intructor-profile-heading">Giảng viên</div>
            <h1 className="instructor-profile-name">{instructor?.fullName}</h1>
            <h2 className="instructor-profile-headline">{instructor?.headline}</h2>
            <div className="instructor-profile-stat-container">
                <div className="instructor-profile-stat-item">
                    <div className="instructor-profile-stat-title">Tổng học viên</div>
                    <div className="instructor-profile-stat-number">{instructor?.numberOfStudent}</div>
                </div>
                <div className="instructor-profile-stat-item">
                    <div className="instructor-profile-stat-title">Đánh giá</div>
                    <div className="instructor-profile-stat-number">{instructor?.numberOfReview}</div>
                </div>
            </div>
            <div className="instructor-profile-course-container">
                <h2 className="instructor-profile-course-heading">Các khóa học của tôi</h2>
                <div className="instructor-profile-course-wrapper">
                    {instructor?.courses && instructor?.courses.map((course, index) => {
                        return <div className="instructor-profile-course-item" key={index}>
                            <Card course={course} />
                        </div>
                    })}
                </div>
            </div>
        </div>
        <div className="instructor-profile-right">
            {instructor?.photo != "" ? <img src={instructor?.photo} alt="instructor-photo" /> :
                <img src="https://img-b.udemycdn.com/user/200_H/216606612_e1ed_2.jpg" alt="instructor-photo" />
            }
        </div>

    </div>
}

export default InstructorProfile;