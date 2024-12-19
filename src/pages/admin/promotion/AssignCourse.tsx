import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseAssignPromotion } from "../../../types/CourseType";
import { getByPromotionId } from "../../../services/CourseService";
import { Button, Flex, Popconfirm, Table, TableColumnsType } from "antd";
import { assignCourse, removeCourse } from "../../../services/PromotionService";

function AssignCourse() {

    const { id } = useParams();

    const [courses, setCourses] = useState<CourseAssignPromotion[]>([]);

    const handleAssign = async (course: CourseAssignPromotion) => {
        if (id) {
            if (!course.assigned) {
                const res = await assignCourse(course.id, id);
                if (res.status == 204) {
                    alert("success")
                    const updatedArray = courses.map(item =>
                        item.id === course.id ? { ...item, assigned: true } : item
                    );
                    setCourses(updatedArray);
                }
            } else {
                const res = await removeCourse(course.id, id);
                if (res.status == 204) {
                    alert("success")
                    const updatedArray = courses.map(item =>
                        item.id === course.id ? { ...item, assigned: false } : item
                    );
                    setCourses(updatedArray);
                }
            }
        }
    }
    const columns: TableColumnsType<CourseAssignPromotion> = [
        {
            title: 'Mã khóa học',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Tiêu đề khóa học',
            dataIndex: 'title',
            width: 150,

        },
        {
            title: 'Hành động',
            dataIndex: 'key',
            width: 250,
            render: (_text, record) => (
                <Flex gap="small" wrap="wrap">
                    <Popconfirm
                        title="Áp dụng cho khóa học này?"
                        description={`Bạn có chắc chắn muốn ${record.assigned == true ? "hủy áp dụng" : "áp dụng"} cho khóa học này?`}
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleAssign(record)}
                    >
                        <Button danger>{record.assigned == true ? "Hủy áp dụng" : "Áp dụng"}</Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];
    const fetchCourseByPromotionId = async () => {
        const res = await getByPromotionId(id);
        if (res.status === 200) {
            const data = res.data as CourseAssignPromotion[]
            const content = data.map((course: CourseAssignPromotion) => (
                {
                    ...course, key: course.id
                }
            ))
            setCourses(content);
        }
    }
    useEffect(() => {
        fetchCourseByPromotionId();
    }, [id])

    return <div className="assigncourse-container">
        <span>Áp dụng cho khóa học</span>
        <Table columns={columns} dataSource={courses} scroll={{ x: 1000 }} />

    </div>
}

export default AssignCourse;