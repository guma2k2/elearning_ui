import { MdCancel, MdKeyboardArrowRight, MdOutlineAssignment, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import './ExerciseDetail.style.scss'
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getExercise } from "../../../services/ExerciseService";
import { ExerciseDetailType, ExerciseFileType } from "../../../types/ClassroomType";
import { Button, Card, Divider, Tabs } from "antd";
import { FaPlus } from "react-icons/fa6";
import { downloadFile } from "../../../services/MediaService";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
function ExerciseDetail() {
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [exercise, setExercise] = useState<ExerciseDetailType>();
    const { id, courseId } = useParams();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cardStyle = {
        width: "300px",
        display: "flex",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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
    const handleDownloadFile = async (file: ExerciseFileType) => {
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
    useEffect(() => {
        fetchExercise();
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
                        <span>Đã nộp</span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />
                    <div className="card-exercise-bottom-header" onClick={handleClick}>
                        <FaPlus />
                        <span>Thêm</span>
                    </div>
                    <div className="card-exercise-file">
                        <img className="card-exercise-file-left" src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="image file" />
                        <div className="card-exercise-file-right">IoT_D20CQCNPM02-N-Nhom8_NGODUCTHUAN_NGUYENXUANCUONG.zip</div>
                        <MdCancel className="card-exercise-file-delete" />
                    </div>
                    <Button type="primary" className="card-exercise-bottom-btn">Nộp bài</Button>
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
                            SINH VIEN
                        </div>,
                    };
                })}
            />
        }




    </div>
}

export default ExerciseDetail;