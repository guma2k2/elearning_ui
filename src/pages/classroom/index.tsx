import { Avatar, Button, Card, Col, Form, Input, Modal, Popconfirm, Row } from 'antd';
import './Classroom.style.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { ClassroomPostType, ClassroomType } from '../../types/ClassroomType';
import { deleteClassroom, getByCourseId, save, update } from '../../services/ClassroomService';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';
import TextArea from 'antd/es/input/TextArea';
import { AxiosError } from 'axios';
import { ErrorType } from '../../types/ErrorType';
import { uploadFile } from '../../services/MediaService';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
const { Meta } = Card;
function Classroom() {
    const navigate = useNavigate();
    let { courseId } = useParams();
    const [form] = Form.useForm();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const [classroomId, setClassroomId] = useState<number | null>();
    const [file, setFile] = useState<File>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false)
    const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);

    const [imageUrl, setImageUrl] = useState<string>("");
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        form.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setClassroomId(null);
        setImageUrl("")
    };
    const redirectToClassroomDetail = (classroomId: number) => {
        navigate(`/classrooms/${classroomId}/c/${courseId}`)
    }


    const redirectToMyLearning = () => {
        navigate(`/my-learning`)
    }



    const onFinish = async (values: ClassroomPostType) => {
        console.log(values);
        const nameClass = values.name;

        const checkIsUploadFile = file != undefined;
        let image = "";

        if (checkIsUploadFile) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("type", "image");

            try {
                console.log(formData);
                const res = await uploadFile(formData);
                if (res.status === 200) {
                    image = res.data.url;
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
        console.log(image);

        const newValues: ClassroomPostType = {
            ...values, name: nameClass.trim(), image: image, courseId: courseId ? parseInt(courseId) : 0
        }

        // setPending(true)
        const type = classroomId ? "update" : "create";
        if (type === "create") {
            try {
                const resSave = await save(newValues);
                console.log(resSave);
                if (resSave.status === 200) {
                    form.resetFields();
                    setIsModalOpen(false);
                    alert("Thêm lớp học thành công")
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message)
                    return;
                }
            }

        } else {
            try {
                const id = classroomId;
                if (id) {
                    const resUpdateUser = await update(newValues, id);
                    if (resUpdateUser.status === 200) {
                        form.resetFields();
                        setIsModalOpen(false)
                        alert("Cập nhật lớp học thành công")
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
        setIsDataUpdated((isDataUpdated) => !isDataUpdated)
        // setPending(false)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selected = files[0] as File;
            const url = URL.createObjectURL(selected);
            console.log(selected);
            setImageUrl(url);
            setFile(selected);
        }
    }

    const handleEditClassroom = (classroomId: number) => {
        setClassroomId(classroomId);

        const currentClassroom = classrooms.find(classroom => classroom.id === classroomId);
        form.setFieldsValue({
            ...currentClassroom,
        })
        if (currentClassroom?.image) {
            setImageUrl(currentClassroom?.image)
        }
        setIsModalOpen(true);
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


    const handleDeleteClassroom = async (classroomId: number) => {
        const res = await deleteClassroom(classroomId);
        if (res.status == 200) {

        }
    }
    useEffect(() => {
        fetchClassroomsByCourseId();
    }, [courseId, isDataUpdated])


    return <div className="classroom-container">
        <div className="classroom-top">
            <div className="classroom-top-left">
                <MdOutlineKeyboardArrowLeft onClick={redirectToMyLearning} className='classroom-icon-back' />
                <img src="https://www.gstatic.com/classroom/logo_square_rounded.svg" alt="classroom icon" />
                <span>Lớp học</span>
            </div>
            <div className="classroom-top-right">
                {auth?.user.role != "ROLE_STUDENT" && <FaPlus onClick={showModal} className='classroom-icon-create' />}
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
            {imageUrl && <img className='classroom-photo' src={imageUrl} alt="avatar" />}
        </Modal>
        <div className="classroom-content">
            {classrooms && classrooms.length > 0 && classrooms.map((classroom) => <Card key={`classroom-${classroom.id}`} onClick={() => redirectToClassroomDetail(classroom.id)}
                style={{ width: 300, cursor: "pointer" }}
                cover={
                    <img
                        alt="classroom image"
                        src={classroom.image}
                        style={{ height: "200px", objectFit: "cover" }}
                    />
                }
            >
                <Meta
                    avatar={<Avatar src={classroom.user.photo} />}
                    title={classroom.name}
                    description={classroom.description}
                />

                {auth?.user.role != "ROLE_STUDENT" && <div className="classroom-action">
                    <Button onClick={(e) => { e.stopPropagation(); handleEditClassroom(classroom.id) }}>Cập nhật</Button>

                    <Popconfirm
                        title="Xóa lớp học này?"
                        description="Bạn có chắc chắn xóa lớp học này?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDeleteClassroom(classroom.id)}
                    >
                        <Button style={{ marginLeft: "10px" }}>Xóa</Button>
                    </Popconfirm>
                </div>}

            </Card>)}
        </div>
    </div>
}
export default Classroom;