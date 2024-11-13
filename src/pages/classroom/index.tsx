import { Avatar, Card } from 'antd';
import './Classroom.style.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ClassroomType } from '../../types/ClassroomType';
import { getByCourseId } from '../../services/ClassroomService';
const { Meta } = Card;
function Classroom() {
    const navigate = useNavigate();
    let { courseId } = useParams();
    const redirectToClassroomDetail = (classroomId: number) => {
        navigate(`/classrooms/${classroomId}`)
    }

    const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);


    const fetchClassroomsByCourseId = async () => {
        const res = await getByCourseId(courseId);
        console.log(res);
        if (res.status === 200) {
            const classroomList = res.data as ClassroomType[]
            console.log(classroomList);
            setClassrooms(classroomList);
        }
    }

    useEffect(() => {
        fetchClassroomsByCourseId();
    }, [courseId])


    return <div className="classroom-container">
        {classrooms && classrooms.length > 0 && classrooms.map((classroom) => <Card key={`classroom-${classroom.id}`} onClick={() => redirectToClassroomDetail(classroom.id)}
            style={{ width: 300 }}
            cover={
                <img
                    alt="classroom image"
                    src={classroom.image}
                />
            }
        >
            <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={classroom.name}
                description={classroom.description}
            />
        </Card>)}

    </div>
}
export default Classroom;