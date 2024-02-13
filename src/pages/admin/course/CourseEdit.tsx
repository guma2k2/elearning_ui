import Tabs from "antd/es/tabs";
import CurriculumList from "./curriculum/CurriculumList";
import CourseLandingPage from "./landingPage/CourseLandingPage";
import Spinner from "../../../components/spinner";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "../../../services/CourseService";
import { CourseType } from "./CourseType";
function CourseEdit() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<CourseType>();
    console.log(id);
    console.log(typeof (id))
    useEffect(() => {
        setIsLoading(true)
        const fetchCourseById = async () => {
            const res = await get(id);
            if (res.status === 200) {
                setCourse(res.data)
            }
            setIsLoading(false)
        }
        fetchCourseById();
    }, [])
    console.log(course);
    return (
        <> {isLoading == true && <Spinner />}
            {isLoading == false && <Tabs
                tabPosition={'left'}
                items={new Array(2).fill(null).map((_, i) => {
                    const id = String(i + 1);
                    if (id == "1") {
                        return {
                            label: 'Curriculum',
                            key: id,
                            children: <CurriculumList />,
                        };
                    }
                    return {
                        label: 'Course landing page',
                        key: id,
                        children: <CourseLandingPage />,
                    };
                })}
            />}

        </>
    );
}

export default CourseEdit