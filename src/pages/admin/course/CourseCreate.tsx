import Tabs from "antd/es/tabs";
import CurriculumList from "./curriculum/CurriculumList";
import CourseLandingPage from "./CourseLandingPage";
function CourseCreate() {

    return (
        <>
            <Tabs
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
            />
        </>
    );
}

export default CourseCreate