import './ClassroomDetail.style.scss'
import Background from "../../../assets/img_classroom_background.jpg"
import { Button, Card, Col, DatePicker, Form, Input, InputRef, Modal, Popconfirm, Rate, Row, Select, Tabs } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ClassroomGetType, ExerciseFilePostType, ExercisePostType, IEvent, IExercise, IMeeting, IReference, MeetingPostType, ReferenceFilePostType, ReferenceFileType, ReferencePostType } from '../../../types/ClassroomType';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getById } from '../../../services/ClassroomService';
import { downloadFile, uploadFile } from '../../../services/MediaService';
import { formatDate } from '../../../utils/Format';
import { MdOutlineAssignment, MdOutlineCancel, MdOutlineEdit, MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import dayjs from 'dayjs';
import { CiTrash } from "react-icons/ci";
import StarIcon from '../../../assets/star.png'
import { ReviewClassroomGet, ReviewClassroomPost } from '../../../types/ReviewClassroomType';
import { createReview, getByClassroomId, getByStudent, updateReview } from '../../../services/ReviewClassroomService';
import Review from '../../../components/review';
import TextArea from 'antd/es/input/TextArea';
import { createMeeting, deleteMeeting, updateMeeting } from '../../../services/MeetingService';
import { createReference, deleteReference, updateReference } from '../../../services/ReferenceService';
import { authToken, createMeetingCode } from '../../../components/meeting/meetingConfig';
import { createReferenceFile, deleteReferenceFile } from '../../../services/ReferenceFileService';
import { AxiosError } from 'axios';
import { ErrorType } from '../../../types/ErrorType';
import { LiaEllipsisVSolid } from 'react-icons/lia';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import ReactQuill from 'react-quill';
import { createExercise, deleteExercise, updateExercise } from '../../../services/ExerciseService';
import { createExerciseFile, deleteExerciseFile } from '../../../services/ExerciseFileService';

const lectureModules = {
    toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Customize the toolbar to include only bold and italic options
    ],
};

const lectureFormats = [
    'bold', 'italic', 'list', 'bullet',
];
type ToggleType = {
    type: "meeting" | "reference"
}
function ClassroomDetail() {
    const fileInputRef = useRef<InputRef | null>(null);
    const fileInputExerciseRef = useRef<InputRef | null>(null);

    const { auth } = useAppSelector((state: RootState) => state.auth);

    let { id, courseId } = useParams();
    const [exerciseDesc, setExerciseDesc] = useState<string>("");
    const navigate = useNavigate();
    const [classroomGet, setClassroomGet] = useState<ClassroomGetType>();
    const [toggle, setToggle] = useState<ToggleType>();
    const [isModalClassroom, setIsModalClassroom] = useState(false);

    const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false)

    const [reviews, setReviews] = useState<ReviewClassroomGet[]>([]);

    const [review, setReview] = useState<ReviewClassroomGet | null>(null);

    const [eventId, setEventId] = useState<number>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ratingText, setRatingText] = useState<string>("Tuyệt vời, trên cả mong đợi!");
    const [form] = Form.useForm();
    const [formMeeting] = Form.useForm();
    const [formReference] = Form.useForm();
    const [formExercise] = Form.useForm();
    const [openExercise, setOpenExercise] = useState<boolean>(false);


    const handleOkExercise = () => {
        formExercise.submit();
    };

    const handleCancleExercise = () => {
        setOpenExercise(false);
        formExercise.resetFields();
        setEventId(undefined)
        setExerciseDesc("");
    };

    const handleOkClassroom = () => {
        if (toggle) {
            if (toggle.type == "meeting") {
                formMeeting.submit();
            } else if (toggle.type == "reference") {
                formReference.submit();
            }
        }
        // setIsModalClassroom(false);
    };

    const handleCancelClassroom = () => {
        setIsModalClassroom(false);
        setToggle(undefined)
        form.resetFields();
        setEventId(undefined)
    };
    const showModalClassroom = () => {
        setIsModalClassroom(true);
    };



    const navigateToMeetingRoom = (code: string) => {
        navigate(`/meeting/${code}`)
    }

    const navigateClassrooms = () => {
        navigate(`/classrooms/course/${courseId}`)
    }

    const handleDownloadFile = async (file: ReferenceFileType) => {
        try {
            const blob = await downloadFile(file);
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary anchor element
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();

            // Clean up the URL and remove the anchor element
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const fetchClassroomById = async () => {
        const res = await getById(id);
        console.log(res);
        if (res.status === 200) {
            const classroom = res.data as ClassroomGetType
            console.log(classroom);
            setClassroomGet(classroom);
        }
    }

    const fetchReviewsClassroomById = async () => {
        const res = await getByClassroomId(id);
        if (res.status === 200) {
            const reviews = res.data as ReviewClassroomGet[]
            setReviews(reviews);
        }
    }

    const fetchReviewByStudent = async () => {
        const res = await getByStudent();
        console.log(res);
        if (res.status === 200) {
            const review = res.data as ReviewClassroomGet
            setReview(review);
        } else {
            setReview(null)
        }
    }
    const hanldeHoverChange = (value: number) => {
        console.log(value);
        switch (value) {
            case 5:
                setRatingText("Tuyệt vời, trên cả mong đợi!")
                break;
            case 4.5:
                setRatingText("Tốt/Tuyệt vời")
                break;
            case 4:
                setRatingText("Tốt, như tôi mong đợi")
                break;
            case 3.5:
                setRatingText("Trung bình/Tốt")
                break;
            case 3:
                setRatingText("Trung bình, lẽ ra có thể hay hơn")
                break;
            case 2.5:
                setRatingText("Kém/Trung bình")
                break;
            case 2:
                setRatingText("Kém, khá thất vọng")
                break;
            case 1.5:
                setRatingText("Rất tệ/Kém")
                break;
            case 1:
                setRatingText("Rất tệ, hoàn toàn không như tôi mong đợi")
                break;

            default:
                break;
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showModaExercise = () => {
        setOpenExercise(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        form.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        // setClassroomId(null);
        // setImageUrl("")
    };

    const onFinish = async (values: ReviewClassroomPost) => {
        console.log('Received values of form: ', values);

        const type: string = review ? "update" : "create";
        console.log(type);
        console.log(id);

        if (id) {
            console.log(parseInt(id));

            const body: ReviewClassroomPost = {
                ...values,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createReview(body);
                if (res.status == 200) {
                    const newOrUpdatedReview = res.data as ReviewClassroomGet
                    setReview(review)
                    setReviews((prevReviews) => {
                        const exists = prevReviews.some(
                            (review) => review.id === newOrUpdatedReview.id
                        );
                        if (exists) {
                            // Update the existing review
                            return prevReviews.map((review) =>
                                review.id === newOrUpdatedReview.id ? newOrUpdatedReview : review
                            );
                        } else {
                            // Add the new review
                            return [...prevReviews, newOrUpdatedReview];
                        }
                    });
                }
            } else {
                if (review) {
                    const reviewId = review.id;
                    const res = await updateReview(body, reviewId);
                    if (res.status == 200) {
                        const newOrUpdatedReview = res.data as ReviewClassroomGet
                        setReview(review)
                        setReviews((prevReviews) => {
                            const exists = prevReviews.some(
                                (review) => review.id === newOrUpdatedReview.id
                            );
                            if (exists) {
                                // Update the existing review
                                return prevReviews.map((review) =>
                                    review.id === newOrUpdatedReview.id ? newOrUpdatedReview : review
                                );
                            } else {
                                // Add the new review
                                return [...prevReviews, newOrUpdatedReview];
                            }
                        });
                    }
                }
            }
        }
    };


    const onFinishMeeting = async (values: MeetingPostType) => {
        console.log('Received values of form: ', values);

        const type: string = eventId ? "update" : "create";

        const formatedStartTime = dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss');
        const formatedEndTime = dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss');
        console.log(type);

        const meetingCode = await createMeetingCode({ token: authToken })

        if (id) {
            const body: MeetingPostType = {
                ...values,
                code: meetingCode,
                startTime: formatedStartTime,
                endTime: formatedEndTime,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createMeeting(body);
                if (res.status == 200) {
                    alert("Thêm cuộc họp thành công")
                    setIsDataUpdated((isDataUpdated) => !isDataUpdated);
                }
            } else {
                if (eventId) {
                    const res = await updateMeeting(body, eventId);
                    if (res.status == 200) {
                        alert("Cập nhật thành công")
                        setIsDataUpdated((isDataUpdated) => !isDataUpdated);
                    }
                }
            }
            setIsModalClassroom(false);
        }
    };


    const onFinishExercise = async (values: ExercisePostType) => {
        const type: string = eventId ? "update" : "create";

        const formatedDeadline = dayjs(values.deadline).format('YYYY-MM-DD HH:mm:ss');


        if (id) {
            const body: ExercisePostType = {
                ...values,
                description: exerciseDesc,
                deadline: formatedDeadline,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createExercise(body);
                if (res.status == 200) {
                    setExerciseDesc("")
                    setIsDataUpdated((isDataUpdated) => !isDataUpdated);
                    alert("Thêm bài tập thành công")
                }
            } else {
                if (eventId) {
                    const res = await updateExercise(body, eventId);
                    if (res.status == 200) {
                        setExerciseDesc("")
                        alert("Cập nhật thành công")
                        setIsDataUpdated((isDataUpdated) => !isDataUpdated);

                    }
                }
            }
            setOpenExercise(false);
        }
    };

    const onFinishFolder = async (values: ReferencePostType) => {
        console.log('Received values of form: ', values);

        const type: string = eventId ? "update" : "create";
        console.log(type);
        console.log(id);

        if (id) {
            console.log(parseInt(id));

            const body: ReferencePostType = {
                ...values,
                classroomId: parseInt(id)
            }
            console.log(body);

            if (type == "create") {
                const res = await createReference(body);
                if (res.status == 200) {
                    alert("Thêm thành công")
                }
            } else {
                if (eventId) {
                    const res = await updateReference(body, eventId);
                    if (res.status == 200) {
                        alert("Cập nhật thành công")
                    }
                }
            }
            setIsModalClassroom(false);
        }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, referenceId: number) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selected = files[0] as File;
            // const url = URL.createObjectURL(selected);
            console.log(selected);
            var formData = new FormData();
            formData.append("file", selected);
            formData.append("type", "other");

            try {
                console.log(formData);
                const res = await uploadFile(formData);
                if (res.status === 200) {
                    const urlFile = res.data.url as string;
                    const body: ReferenceFilePostType = {
                        fileName: selected.name,
                        fileUrl: urlFile,
                        referenceId: referenceId
                    }

                    const resCreateReferenceFile = await createReferenceFile(body);
                    if (resCreateReferenceFile.status == 200) {
                        console.log(resCreateReferenceFile.data);
                        alert("Thêm tài liệu thành công");
                        setIsDataUpdated((prev) => !prev)
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
    }


    const handleExerciseFileChange = async (event: ChangeEvent<HTMLInputElement>, id: number) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selected = files[0] as File;
            // const url = URL.createObjectURL(selected);
            console.log(selected);
            var formData = new FormData();
            formData.append("file", selected);
            formData.append("type", "other");

            try {
                console.log(formData);
                const res = await uploadFile(formData);
                if (res.status === 200) {
                    const urlFile = res.data.url as string;
                    const body: ExerciseFilePostType = {
                        fileName: selected.name,
                        fileUrl: urlFile,
                        exerciseId: id
                    }

                    const resCreate = await createExerciseFile(body);
                    if (resCreate.status == 200) {
                        console.log(resCreate.data);
                        alert("Thêm tài liệu thành công");
                        setIsDataUpdated((prev) => !prev)
                    }
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
        }
    }


    const handleAddNewReferenceFolder = () => {
        fileInputRef.current?.input?.click();
    }


    const handleAddNewExerciseFolder = () => {
        fileInputExerciseRef.current?.input?.click();
    }

    const handleChange = (value: "meeting" | "reference") => {
        console.log(`selected ${value}`);
        setToggle({ type: value })
    };



    const handleEditMeeting = (meetingId: number) => {
        setEventId(meetingId)
        setToggle({ type: "meeting" })
        setIsModalClassroom(true);
        const currentEvent = getEventByID("meeting", meetingId);


        if (currentEvent && currentEvent.type == "meeting") {
            formMeeting.setFieldsValue({
                id: currentEvent.id,
                startTime: dayjs(currentEvent.startTime, 'DD/MM/YYYY HH:mm:ss'),
                endTime: dayjs(currentEvent.endTime, 'DD/MM/YYYY HH:mm:ss'),
            })
        }
    }


    const handleEditExercise = (exId: number) => {
        setEventId(exId)
        setOpenExercise(true);
        const currentEvent = getEventByID("exercise", exId);


        if (currentEvent && currentEvent.type == "exercise") {
            console.log(currentEvent);
            formExercise.setFieldsValue({
                id: currentEvent.id,
                title: currentEvent.title,
                deadline: dayjs(currentEvent.deadline, 'DD/MM/YYYY HH:mm:ss'),
            })
            setExerciseDesc(currentEvent.description);
        }
    }

    const handleEditReference = (referenceId: number) => {
        setEventId(referenceId)
        setToggle({ type: "reference" })
        setIsModalClassroom(true);
        const currentEvent = getEventByID("reference", referenceId);

        if (currentEvent && currentEvent.type == "reference") {
            formReference.setFieldsValue({
                id: currentEvent.id,
                description: currentEvent.description
            })
        }
    }

    const getEventByID = (type: "meeting" | "reference" | "exercise", eId: number): IMeeting | IReference | IExercise | undefined => {
        const event = classroomGet?.events.find((e) => e.type === type && e.id === eId);
        return event;
    };

    const handleDeleteMeeting = async (meetingId: number) => {
        const res = await deleteMeeting(meetingId)
        if (res.status == 200) {
            alert("Xóa thành công")
            setIsDataUpdated((prev) => !prev)
        }
    }

    const handleDeleteExercise = async (exId: number) => {

        try {
            const res = await deleteExercise(exId)
            if (res.status == 200) {
                alert("Xóa thành công")
                setIsDataUpdated((prev) => !prev)
            }

        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message);
            }
        }

    }

    const handleDeleteReference = async (referenceId: number) => {
        try {
            const res = await deleteReference(referenceId)
            if (res.status == 200) {
                alert("Xóa thành công")
                setIsDataUpdated((prev) => !prev)
            }

        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                const message = data.details;
                alert(message);
            }
        }
    }

    const handleDeleteReferenceFile = async (referenceFileId: number) => {
        const res = await deleteReferenceFile(referenceFileId);
        if (res.status == 200) {
            alert("Xóa thành công")
            setIsDataUpdated((prev) => !prev)
        }
    }

    const handleDeleteExerciseFile = async (id: number) => {
        const res = await deleteExerciseFile(id);
        if (res.status == 200) {
            alert("Xóa thành công")
            setIsDataUpdated((prev) => !prev)
        }
    }

    const cardStyle = {
        border: "1px solid rgb(224 224 224)",
        cursor: "pointer",
        width: "780px",
        padding: "20px 40px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    };

    const cardStyle1 = {
        width: "780px",
        padding: "0 40px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    };

    const cardHoverStyle = {
        backgroundColor: "#f5f5f5", // Hover background color
        transform: "translateY(-3px)", // Slight lift effect
    };

    const cardTopStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };

    const cardTopLeftStyle = {
        display: "flex",
        gap: "15px",
    };

    const cardTopRightStyle = {
        display: "flex",
        gap: "12px",
        cursor: "pointer",
    };

    const handleRedirectToExerciseDetail = (exerciseId: number) => {
        navigate(`/exercise/${exerciseId}/detail/c/${courseId}`)
    }


    useEffect(() => {
        fetchClassroomById();
        fetchReviewsClassroomById();
        if (auth) {
            if (auth.user.role == "ROLE_STUDENT") {
                fetchReviewByStudent();
            }
        }
    }, [id])

    useEffect(() => {
        fetchClassroomById();
    }, [isDataUpdated])



    return <div className="classroomDetail-container">
        <div className="classroomDetail-top">
            <MdOutlineKeyboardArrowLeft onClick={navigateClassrooms} className="classromDetail-back" />
            <img src={Background} alt="classroom detail" />
            <div className="classroomDetail-text">
                <div className="classroomDetail-Title">{classroomGet?.name}</div>
                <div className="classroomDetail-Desc">{classroomGet?.description}</div>
            </div>

            <Modal title="Tạo sự kiện" open={isModalClassroom} onOk={handleOkClassroom} onCancel={handleCancelClassroom} >
                <Col span={24}>
                    <Form.Item
                        label="Chọn loại sự kiện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Select
                            value={toggle?.type}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                            }}
                            options={[
                                {
                                    value: 'meeting',
                                    label: 'Cuộc họp',
                                },
                                {
                                    value: 'reference',
                                    label: 'Tài liệu',
                                },

                            ]}
                        />
                    </Form.Item>
                </Col>

                {toggle?.type == "meeting" && <Form layout="horizontal" onFinish={onFinishMeeting} form={formMeeting} wrapperCol={{ span: 16 }} labelCol={{ span: 8 }} style={{ maxWidth: "100%" }} >
                    <Form.Item
                        name="id"
                        style={{ display: "none" }}
                    >
                        <Input placeholder="id" type='hidden' />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="startTime"
                                label="Thời gian bắt đầu"
                                rules={[{ required: true, message: 'Thời gian bắt đầu không được để trống' }]}
                            >
                                <DatePicker
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="endTime"
                                label="Thời gian kết thúc"
                                rules={[{ required: true, message: 'Thời gian kết thúc không được để trống' }]}
                            >
                                <DatePicker
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>}

                {toggle?.type == "reference" &&
                    <Form layout="horizontal" onFinish={onFinishFolder} form={formReference} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} style={{ maxWidth: "100%" }} >
                        <Form.Item
                            name="id"
                            style={{ display: "none" }}
                        >
                            <Input placeholder="id" type='hidden' />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Mô tả thư mục"
                                >
                                    <TextArea placeholder="Nhập mô tả lớp học" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>}
            </Modal>

            <Modal width={800} title="Tạo bài tập" open={openExercise} onOk={handleOkExercise} onCancel={handleCancleExercise} >
                <Form layout="horizontal" onFinish={onFinishExercise} form={formExercise} wrapperCol={{ span: 20 }} labelCol={{ span: 4 }} style={{ maxWidth: "100%" }} >
                    <Form.Item
                        name="id"
                        style={{ display: "none" }}
                    >
                        <Input placeholder="id" type='hidden' />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: true, message: 'Tiêu đề không được bỏ trống' }]}
                            >
                                <Input placeholder="Nhập tiêu đề" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle" style={{ marginBottom: "10px" }}>
                        <Col span={4} style={{ textAlign: "right", paddingRight: "10px" }}>
                            <label style={{ lineHeight: "32px", alignItems: "start" }}>Mô tả</label>
                        </Col>
                        <Col span={20}>
                            <ReactQuill
                                modules={lectureModules}
                                formats={lectureFormats}
                                theme="snow"
                                value={exerciseDesc}
                                onChange={setExerciseDesc}
                                placeholder="Có thể bỏ trống"
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="deadline"
                                label="Hạn nộp"
                                rules={[{ required: true, message: 'Thời hạn không được bỏ trống' }]}
                            >
                                <DatePicker
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
        <Tabs
            tabPosition={'left'}
            items={new Array(2).fill(null).map((_, i) => {
                const id = String(i + 1);
                if (id == "1") {
                    return {
                        label: 'Chi tiết lớp học',
                        key: id,
                        children:
                            <div className="classroomDetail-content">
                                {auth?.user.role != "ROLE_STUDENT" && <div style={{ display: "flex", gap: "10px" }} ><Button onClick={showModalClassroom}>Thêm sự kiện cho lớp học</Button> <Button onClick={showModaExercise}>Thêm bài tập</Button></div>}

                                {classroomGet && classroomGet.events.map((event) => {
                                    if (event.type == "meeting") {
                                        return <Card
                                            key={`meeting-${event.id}`}
                                            style={cardStyle1}

                                        >
                                            <div className="classroomDetail-card-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <div className="classroomDetail-card-topLeft" style={{ display: "flex", gap: "15px" }} >
                                                    <img src={classroomGet.user.photo} alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "contain" }} />
                                                    <div className="classroomDetail-card-top-right">
                                                        <div>Giáo viên đã đăng thông tin cho một cuộc họp</div>
                                                        <div>{formatDate(event.createdAt)}</div>
                                                        <div>Thời gian: {event.startTime} đến {event.endTime} </div>
                                                    </div>
                                                    <Button onClick={() => navigateToMeetingRoom(event.code)}>Tham gia cuộc họp</Button>
                                                </div>
                                                <div className="classroomDetail-card-topRight">
                                                    {auth?.user.role != "ROLE_STUDENT" && <><MdOutlineEdit onClick={() => handleEditMeeting(event.id)} style={{ fontSize: "20px", cursor: "pointer", marginRight: "12px" }} />
                                                        <Popconfirm
                                                            title="Xóa buổi họp này?"
                                                            description="Bạn có chắc chắn xóa buổi họp này?"
                                                            okText="Có"
                                                            cancelText="Không"
                                                            onConfirm={() => handleDeleteMeeting(event.id)}
                                                        >
                                                            <CiTrash style={{ fontSize: "20px", cursor: "pointer" }}

                                                            />
                                                        </Popconfirm></>}
                                                </div>
                                            </div>
                                        </Card>
                                    } else if (event.type == "exercise") {
                                        return <div style={{ display: "flex", flexDirection: 'column' }} key={`exercise-${event.id}`} >
                                            <div
                                                key={`exercise-${event.id}`}
                                                style={cardStyle}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = cardHoverStyle.backgroundColor)}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = cardStyle.backgroundColor)}
                                                onClick={() => handleRedirectToExerciseDetail(event.id)}
                                            >
                                                <div className="classroomDetail-card-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <div className="classroomDetail-card-topLeft" style={{ display: "flex", gap: "15px" }} >
                                                        <MdOutlineAssignment style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                                        <div className="classroomDetail-card-top-right">
                                                            <div>{classroomGet.user.firstName} {classroomGet.user.lastName} đã đăng một bài tập mới: {event.title}</div>
                                                            <div>{formatDate(event.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="classroomDetail-card-topRight">
                                                        {auth?.user.role != "ROLE_STUDENT" && <><MdOutlineEdit onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditExercise(event.id);
                                                        }} style={{ fontSize: "20px", cursor: "pointer", marginRight: "12px" }} />
                                                            <Popconfirm
                                                                title="Xóa bài tập này?"
                                                                description="Bạn có chắc chắn xóa bài tập này?"
                                                                okText="Có"
                                                                cancelText="Không"
                                                                onConfirm={(e) => {
                                                                    e?.stopPropagation();
                                                                    handleDeleteExercise(event.id)
                                                                }}
                                                            >
                                                                <CiTrash style={{ fontSize: "20px", cursor: "pointer" }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </Popconfirm></>}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="classroomDetail-card-bottom" style={{ display: "flex", gap: "20px", flexWrap: "wrap", width: "780px", padding: "40px", backgroundColor: "#fff", border: "1px solid rgb(224 224 224)" }}>
                                                {event.type == "exercise" && event.files.length > 0 && event.files.map((file) => {
                                                    return <Card style={{ width: "calc(50% - 20px)", cursor: "pointer", position: "relative" }} key={`exercise-file-${file.id}`} onClick={() => handleDownloadFile(file)} >
                                                        <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                                                            <img style={{ flex: "4", height: "70px", objectFit: "contain" }} src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="" />
                                                            <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                                                <div>{file.fileName}</div>
                                                            </div>
                                                            {auth?.user.role != "ROLE_STUDENT" && <MdOutlineCancel
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteExerciseFile(file.id)
                                                                }}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "8px",
                                                                    right: "8px",
                                                                    fontSize: "20px", /* Adjust size as needed */
                                                                    cursor: "pointer",
                                                                    color: "red"
                                                                }} />}
                                                        </div>
                                                    </Card>
                                                })}
                                                {auth?.user.role != "ROLE_STUDENT" && <Card style={{ width: "calc(50% - 20px)", cursor: "pointer" }} onClick={() => handleAddNewExerciseFolder()} >
                                                    <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                                                        <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                                            <label>Thêm tài liệu</label>
                                                            <Input ref={fileInputExerciseRef} style={{ display: "none" }} type="file" onChange={(e) => handleExerciseFileChange(e, event.id)} />
                                                        </div>
                                                    </div>
                                                </Card>}
                                            </div>

                                        </div>
                                    }
                                    return <Card
                                        key={`document-${event.id}`}
                                        style={cardStyle1}

                                    >
                                        <div className="classroomDetail-card-top" style={{ display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "space-between" }}>
                                            <div className="classroomDetail-card-topLeft" style={{ display: "flex", gap: "15px" }} >
                                                <img src={classroomGet.user.photo} alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                                <div className="classroomDetail-card-top-right">
                                                    <div>Giáo viên</div>
                                                    <div>{formatDate(event.createdAt)}</div>
                                                </div>
                                            </div>

                                            <div className="classroomDetail-card-topRight">

                                                {auth?.user.role != "ROLE_STUDENT" && <><MdOutlineEdit onClick={() => handleEditReference(event.id)} style={{ fontSize: "20px", cursor: "pointer", marginRight: "12px" }} />
                                                    <Popconfirm
                                                        title="Xóa tài liệu này?"
                                                        description="Bạn có chắc chắn xóa tài liệu này?"
                                                        okText="Có"
                                                        cancelText="Không"
                                                        onConfirm={() => handleDeleteReference(event.id)}
                                                    >
                                                        <CiTrash style={{ fontSize: "20px", cursor: "pointer" }}
                                                        />
                                                    </Popconfirm></>}

                                            </div>
                                        </div>
                                        <div className="classroomDetail-card-middle" style={{ margin: "10px 0" }}>{event.description}</div>
                                        <div className="classroomDetail-card-bottom" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                            {event.type == "reference" && event.files.length > 0 && event.files.map((file) => {
                                                return <Card style={{ width: "calc(50% - 20px)", cursor: "pointer", position: "relative" }} key={`file-${file.id}`} onClick={() => handleDownloadFile(file)} >
                                                    <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                                                        <img style={{ flex: "4", height: "70px", objectFit: "contain" }} src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="" />
                                                        <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                                            <div>{file.fileName}</div>
                                                        </div>
                                                        {auth?.user.role != "ROLE_STUDENT" && <MdOutlineCancel
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteReferenceFile(file.id)
                                                            }}
                                                            style={{
                                                                position: "absolute",
                                                                top: "8px",
                                                                right: "8px",
                                                                fontSize: "20px", /* Adjust size as needed */
                                                                cursor: "pointer",
                                                                color: "red"
                                                            }} />}
                                                    </div>
                                                </Card>
                                            })}
                                            {auth?.user.role != "ROLE_STUDENT" && <Card style={{ width: "calc(50% - 20px)", cursor: "pointer" }} onClick={() => handleAddNewReferenceFolder()} >
                                                <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                                                    <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                                        <label>Thêm tài liệu</label>
                                                        <Input ref={fileInputRef} style={{ display: "none" }} type="file" onChange={(e) => handleFileChange(e, event.id)} />
                                                    </div>
                                                </div>
                                            </Card>}

                                        </div>
                                    </Card>
                                })}


                            </div>,
                    };
                }
                return {
                    label: 'Đánh giá lớp học',
                    key: id,
                    children: <div className="classroomDetail-content">
                        <div className="review-header">
                            <div className="review-total-rating">
                                <img src={StarIcon} alt="star icon" />
                                <span>4,5 xếp hạng khóa học</span>
                            </div>
                            <span>({reviews.length} xếp hạng)</span>
                        </div>

                        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} rootClassName="review-modal" okText={"Lưu và tiếp tục"}>
                            <h1>Vì sao bạn xếp hạng ở mức này?</h1>
                            <span className="review-modal-rating-text">{ratingText}</span>
                            <Form
                                form={form}
                                name="validate_other"
                                onFinish={onFinish}
                                style={{ width: "100%" }}
                                initialValues={{
                                    'ratingStar': review ? review.ratingStar : 5,
                                    'content': review ? review.content : "",
                                }}
                            >
                                <Form.Item name="classroomId" hidden><Input hidden={true} /></Form.Item>
                                <Form.Item name="ratingStar">
                                    <Rate className="review-modal-rating-icon" allowHalf onHoverChange={hanldeHoverChange} />
                                </Form.Item>
                                <Form.Item name="content">
                                    <TextArea style={{ width: "100%" }} rows={4} placeholder="Hãy cho chúng tôi biết trải nghiệm cá nhân của riêng bạn khi tham gia khóa học này. Khóa học có phù hợp với bạn không?" />
                                </Form.Item>
                            </Form>
                        </Modal>
                        {auth && auth.user.role == "ROLE_STUDENT" && <Button onClick={showModal}>{review ? "Cập nhật" : "Viết"} đánh giá</Button>}
                        <div className="review-wrapper">
                            {reviews && reviews.length > 0 && reviews.map((review) => <Review review={review} key={`review-of-classroom-${review.id}`} isFilter={false} />)}
                        </div>
                    </div>,
                };
            })}
        />

    </div>
}
export default ClassroomDetail;