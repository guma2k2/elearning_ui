import Tabs from "antd/es/tabs";
import CurriculumList from "./curriculum/CurriculumList";
import CourseLandingPage from "./landingPage/CourseLandingPage";
import Spinner from "../../../components/spinner";
import { useParams } from "react-router-dom";
import { useEffect, } from "react";
import { RootState } from "../../../redux/store";
import { fetchCourseById } from "../../../redux/slices/CourseSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import IntendedLeaners from "./intended-learners/IntendedLearners";
function CourseEdit() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { currentCourse, isLoading } = useAppSelector((state: RootState) => state.courses);

    useEffect(() => {
        dispatch(fetchCourseById(id));
    }, [id])

    return (
        <> {isLoading == true && <Spinner />}
            {isLoading == false && <Tabs
                tabPosition={'left'}
                items={new Array(3).fill(null).map((_, i) => {
                    const id = String(i + 1);
                    if (id == "1") {
                        return {
                            label: 'Intended learners',
                            key: id,
                            children: <IntendedLeaners course={currentCourse} />,
                        };
                    } else if (id == "2") {
                        return {
                            label: 'Curriculum',
                            key: id,
                            children: <CurriculumList course={currentCourse} />,
                        };
                    }
                    return {
                        label: 'Course landing page',
                        key: id,
                        children: <CourseLandingPage course={currentCourse} />,
                    };
                })}
            />}

        </>
    );
}

export default CourseEdit