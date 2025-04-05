import { MdCancel, MdKeyboardArrowRight, MdOutlineAssignment, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import './ExerciseDetail.style.scss'
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getExercise } from "../../../services/ExerciseService";
import { ExerciseDetailType, ExerciseFileType, StudentExerciseGetType, StudentExercisePostType, StudentExerciseType } from "../../../types/ClassroomType";
import { Button, Card, Divider, Flex, Spin, Table, TableColumnsType, Tabs } from "antd";
import { FaPlus } from "react-icons/fa6";
import { downloadFile, uploadFile } from "../../../services/MediaService";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { createStudentExercise, deleteStudentExercise, getByExercise, getListByExercise, updateStudentExercise } from "../../../services/StudentExerciseService";
import { parse } from "date-fns";
import { AxiosError } from "axios";
import { ErrorType } from "../../../types/ErrorType";
function ExerciseDetail() {
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [exercise, setExercise] = useState<ExerciseDetailType>();
    const { id, courseId } = useParams();
    const [studentExercise, setStudentExercise] = useState<StudentExerciseType | null>(null);
    const [studentExerciseList, setStudentExerciseList] = useState<StudentExerciseGetType[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        let url: string = "";
        if (file) {
            setLoading(true);
            var formData = new FormData();
            formData.append("file", file);
            formData.append("type", "other");
            const res = await uploadFile(formData);
            if (res.status === 200) {
                url = res.data.url;
            }

            const request: StudentExercisePostType = {
                fileName: file.name,
                fileUrl: url,
                exerciseId: exercise?.id,
                submitted: false
            }

            try {
                const resCreate = await createStudentExercise(request);
                if (resCreate.status == 200) {
                    const data = resCreate.data as StudentExerciseType;
                    setStudentExercise(data);
                    setLoading(false);
                }

            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    setLoading(false);
                    alert(message);
                }
            }

        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const fetchExercise = async () => {
        if (id) {
            const res = await getExercise(id);
            if (res.status == 200) {
                const data = res.data as ExerciseDetailType
                setExercise(data);
            }
        }
    }

    const fetchByExercise = async () => {
        if (id) {
            const res = await getListByExercise(id);
            if (res.status == 200) {
                const content = res.data.content.map((item: StudentExerciseGetType) => (
                    {
                        ...item, key: item.id
                    }
                ))
                setStudentExerciseList(content);
            }
        }
    }


    const fetchByExerciseAndStudent = async () => {
        if (id) {
            const res = await getByExercise(id);
            if (res.status == 200) {
                const data = res.data as StudentExerciseType
                setStudentExercise(data);
            } else if (res.status == 204) {
                setStudentExercise(null);
            }
        }
    }


    const handleDownloadFile = async (file: ExerciseFileType | StudentExerciseType | StudentExerciseGetType) => {
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


    const handleNavigateToClassroomDetail = () => {
        navigate(`/classrooms/${exercise?.id}/c/${courseId}`)
    }

    const getSubmitStatusString = () => {
        if (studentExercise && studentExercise != null) {
            if (studentExercise.submitted == true) {
                // check is submmited correct time
                if (exercise) {
                    const submittedDate = parse(
                        studentExercise.submittedTime,
                        "dd/MM/yyyy HH:mm:ss",
                        new Date()
                    );
                    const deadlineDate = parse(exercise.deadline,
                        "dd/MM/yyyy HH:mm:ss",
                        new Date());
                    if (submittedDate > deadlineDate) {
                        return "Nộp muộn"
                    }
                }
                return "Đã nộp";
            }
        }
        return "Chưa nộp"
    }

    const handleDeleteStudentExercise = async () => {
        if (studentExercise && studentExercise != null) {
            const res = await deleteStudentExercise(studentExercise.id);
            if (res.status === 200) {

                setStudentExercise(null);
            }
        }
    }

    const handleUpdateStudentExercise = async () => {
        if (studentExercise && studentExercise != null) {
            if (exercise) {
                const request: StudentExercisePostType = {
                    fileName: studentExercise.fileName,
                    fileUrl: studentExercise.fileUrl,
                    submitted: studentExercise.submitted == false ? true : false,
                    exerciseId: exercise.id
                }
                const resUpdate = await updateStudentExercise(request, studentExercise.id);
                if (resUpdate.status == 200) {
                    const data = resUpdate.data as StudentExerciseType
                    alert("success");
                    setStudentExercise(data);
                }
            }
        }
    }

    const columns: TableColumnsType<StudentExerciseGetType> = [
        {
            title: 'Mã bài tập học sinh',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: 'Email học sinh',
            dataIndex: 'email',
            width: 300,
            render: (_text, record) => {
                return <Flex gap="small" wrap="wrap">
                    <span>{record.student.email}</span>
                </Flex>
            }
        },
        {
            title: 'Bài tập',
            dataIndex: 'exercise',
            width: 500,
            render: (_text, record) => {
                return <Flex gap="small" wrap="wrap">
                    <span onClick={() => handleDownloadFile(record)} style={{ cursor: "pointer", textDecoration: "underline", color: "rgb(26,115,232)" }}>{record.fileName}</span>
                </Flex>
            }
            ,
        }
    ];


    useEffect(() => {
        fetchExercise();
        if (auth) {
            if (auth.user.role == "ROLE_STUDENT") {
                fetchByExerciseAndStudent();
            } else {
                fetchByExercise();
            }

        }
    }, [id])

    return <div className="exercise-container">
        <div className="exercise-top">
            <div className="exercise-top-left">
                <img src="https://www.gstatic.com/classroom/logo_square_rounded.svg" alt="exercise icon" />
                <span>Lớp học</span>
                <MdKeyboardArrowRight className="exercise-icon-back" />
                <span style={{ cursor: "pointer" }} onClick={handleNavigateToClassroomDetail}>{exercise?.classroom.name}</span>
            </div>
            <div className="exercise-top-right">
            </div>
        </div>

        {auth?.user.role == "ROLE_STUDENT" ? <div className="exercise-content">
            <div className="exercise-content-left">
                <div className="exercise-content-left-top">
                    <div className="exercise-content-left-top-left">
                        <div className="exercise-content-title-wrapper">
                            <MdOutlineAssignment className="exercise-content-left-top-left-icon" />
                            <span className="exercise-content-title">{exercise?.title}</span>
                        </div>


                        <div className="exercise-content-user">
                            <span>{exercise?.classroom.user.firstName} {exercise?.classroom.user.lastName}</span>
                            {/* <span>{exercise?.createdAt}</span> */}
                        </div>

                    </div>
                    <div className="exercise-content-left-top-right">Đến hạn {exercise?.deadline}</div>
                </div>
                <Divider className="exercise-divider" />
                <div className="exercise-content-description" style={{ marginBottom: "15px" }} dangerouslySetInnerHTML={{ __html: exercise ? exercise.description : "<p></p>" }}></div>
                <div className="exercise-content-files">
                    {exercise?.files.map((file) => <div className="exercise-content-file" key={`exercise-file-${file.id}`} onClick={() => handleDownloadFile(file)} >
                        <img src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" className="exercise-icon-download" />
                        <div className="exercise-cardBottom-file-right">
                            <div >{file.fileName}</div>
                        </div>
                    </div>)}
                </div>


            </div>
            <div className="exercise-content-right" >
                <div className="exercise-content-card-right">
                    <div className="card-exercise-top-header">
                        <span>Bài tập của bạn</span>
                        <span>{getSubmitStatusString()}</span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />
                    {studentExercise == null && <Spin spinning={loading} tip="Loading..." style={{ width: "100%" }}>
                        <div className="card-exercise-bottom-header" onClick={handleClick}>
                            <FaPlus />
                            <span>Thêm</span>
                        </div>
                    </Spin>}
                    {studentExercise && studentExercise != null &&
                        <div className="card-exercise-file" onClick={() => handleDownloadFile(studentExercise)}>
                            <img className="card-exercise-file-left" src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="image file" />
                            <div className="card-exercise-file-right">{studentExercise.fileName}</div>
                            {studentExercise.submitted == false && <MdCancel className="card-exercise-file-delete" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStudentExercise();
                            }} />}
                        </div>}
                    <Button type="primary" className="card-exercise-bottom-btn" onClick={handleUpdateStudentExercise} >{studentExercise && studentExercise != null && studentExercise.submitted == true ? "Hủy nộp bài" : "Nộp bài"}</Button>
                </div>
            </div>
        </div> :
            <Tabs
                tabPosition={'top'}
                items={new Array(2).fill(null).map((_, i) => {
                    const id = String(i + 1);
                    if (id == "1") {
                        return {
                            label: 'Bài tập',
                            key: id,
                            children: <div className="exercise-content">
                                <div className="exercise-content-left">
                                    <div className="exercise-content-left-top">
                                        <div className="exercise-content-left-top-left">
                                            <div className="exercise-content-title-wrapper">
                                                <MdOutlineAssignment className="exercise-content-left-top-left-icon" />
                                                <span className="exercise-content-title">{exercise?.title}</span>
                                            </div>


                                            <div className="exercise-content-user">
                                                <span>{exercise?.classroom.user.firstName} {exercise?.classroom.user.lastName}</span>
                                                {/* <span>{exercise?.createdAt}</span> */}
                                            </div>

                                        </div>
                                        <div className="exercise-content-left-top-right">Đến hạn {exercise?.deadline}</div>
                                    </div>
                                    <Divider className="exercise-divider" />
                                    <div className="exercise-content-description" style={{ marginBottom: "15px" }} dangerouslySetInnerHTML={{ __html: exercise ? exercise.description : "<p></p>" }}></div>
                                    <div className="exercise-content-files">
                                        {exercise?.files.map((file) => <div className="exercise-content-file" key={`exercise-file-${file.id}`} onClick={() => handleDownloadFile(file)} >
                                            <img src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" className="exercise-icon-download" />
                                            <div className="exercise-cardBottom-file-right">
                                                <div >{file.fileName}</div>
                                            </div>
                                        </div>)}
                                    </div>


                                </div>
                                <div className="exercise-content-right" ></div>
                            </div>,
                        }
                    }
                    return {
                        label: 'Bài tập của học viên',
                        key: id,
                        children: <div className="exercise-content-student">
                            <span>Bài tập của học sinh</span>
                            <Table columns={columns} dataSource={studentExerciseList} scroll={{ x: 1000 }} />
                        </div>,
                    };
                })}
            />
        }




    </div>
}

export default ExerciseDetail;