import { Avatar, Card, Col, Form, Input, Modal, Row } from 'antd';
import './Classroom.style.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { ClassroomPostType, ClassroomType } from '../../types/ClassroomType';
import { getByCourseId, save, update } from '../../services/ClassroomService';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';
import TextArea from 'antd/es/input/TextArea';
import { AxiosError } from 'axios';
import { ErrorType } from '../../types/ErrorType';
const { Meta } = Card;
function Classroom() {
    const navigate = useNavigate();
    let { courseId } = useParams();
    const [form] = Form.useForm();

    const [classroomId, setClassroomId] = useState<number>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [imageUrl, setImageUrl] = useState<string>("");
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const redirectToClassroomDetail = (classroomId: number) => {
        navigate(`/classrooms/${classroomId}/c/${courseId}`)
    }


    const redirectToMyLearning = () => {
        navigate(`/my-learning`)
    }

    const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);


    const onFinish = async (values: ClassroomPostType) => {
        console.log(values);
        const nameCat = values.name;
        const newValues: ClassroomPostType = {
            ...values, name: nameCat.trim(), image: imageUrl
        }
        // setPending(true)
        const type = classroomId ? "update" : "create";
        if (type === "create") {
            try {
                const resSave = await save(newValues);
                console.log(resSave);
                if (resSave.status === 201) {
                    form.resetFields();
                    setIsModalOpen(false);
                    alert("Add category successful")
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    // setPending(false);

                    return;
                }
            }

        } else {
            try {
                const id = classroomId;
                if (id) {
                    const resUpdateUser = await update(newValues, id);
                    if (resUpdateUser.status === 204) {
                        form.resetFields();
                        setIsModalOpen(false)
                        alert("Update category successful")
                    }
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    // setPending(false);
                    return;
                }
            }

        }
        // setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        // setPending(false)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selected = files[0] as File;
            const url = URL.createObjectURL(selected);
            console.log(selected);
            setImageUrl(url);
        }
    }

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
        <div className="classroom-top">
            <div className="classroom-top-left">
                <MdOutlineKeyboardArrowLeft onClick={redirectToMyLearning} className='classroom-icon-back' />
                <img src="https://www.gstatic.com/classroom/logo_square_rounded.svg" alt="classroom icon" />
                <span>Lớp học</span>
            </div>
            <div className="classroom-top-right">
                <FaPlus onClick={showModal} className='classroom-icon-create' />
            </div>
        </div>
        <Modal title="Tạo lớp học" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
            <Form layout="horizontal" onFinish={onFinish} form={form} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} style={{ maxWidth: "100%" }} >
                <Form.Item
                    name="id"
                    style={{ display: "none" }}
                >
                    <Input placeholder="id" type='hidden' />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Tên lớp học"
                            rules={[{ required: true, message: 'Tên danh mục không được bỏ trống' }]}
                        >
                            <Input placeholder="Nhập tên lớp học" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Mô tả lớp học"
                        >
                            <TextArea placeholder="Nhập mô tả lớp học" />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
            <Input type="file" onChange={handleFileChange} />
        </Modal>
        <div className="classroom-content">
            {classrooms && classrooms.length > 0 && classrooms.map((classroom) => <Card key={`classroom-${classroom.id}`} onClick={() => redirectToClassroomDetail(classroom.id)}
                style={{ width: 300, cursor: "pointer" }}
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
    </div>
}
export default Classroom;