import './ClassroomDetail.style.scss'
import Background from "../../../assets/img_classroom_background.jpg"
import { Button, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ClassroomGetType, ReferenceFileType } from '../../../types/ClassroomType';
import { useEffect, useState } from 'react';
import { getById } from '../../../services/ClassroomService';
import { downloadFile } from '../../../services/MediaService';
function ClassroomDetail() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [classroomGet, setClassroomGet] = useState<ClassroomGetType>();


    const navigateToMeetingRoom = (code: string) => {
        navigate(`/meeting/${code}`)
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

    useEffect(() => {
        fetchClassroomById();
    }, [id])

    return <div className="classroomDetail-container">
        <div className="classroomDetail-top">
            <img src={Background} alt="classroom detail" />
            <div className="classroomDetail-text">
                <div className="classroomDetail-Title">{classroomGet?.name}</div>
                <div className="classroomDetail-Desc">{classroomGet?.description}</div>
            </div>
        </div>
        <div className="classroomDetail-content">
            {classroomGet && classroomGet.events.map((event) => {
                if (event.type == "meeting") {
                    return <Card
                        key={`meeting-${event.id}`}
                        style={{ width: "780px", padding: "0 40px" }}
                    >
                        <div className="classroomDetail-card-top" style={{ display: "flex" }}>
                            <img src="https://lh3.googleusercontent.com/a/ACg8ocLf5401BY_QkReNX4ZNaR6_hs5i0n_rgUA7Zrf9z6EQd5ukMw=s40-c-mo" alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                            <div className="classroomDetail-card-top-right">
                                <div>Instructor đã đăng thông tin cho một cuộc họp</div>
                                <div>{event.createdAt}</div>
                            </div>
                            <Button onClick={() => navigateToMeetingRoom(event.code)}>Tham gia cuoc hop</Button>
                        </div>
                    </Card>
                }
                return <Card
                    style={{ width: "780px", padding: "20px 40px" }}
                >
                    <div className="classroomDetail-card-top" style={{ display: "flex" }}>
                        <img src="https://lh3.googleusercontent.com/a/ACg8ocLf5401BY_QkReNX4ZNaR6_hs5i0n_rgUA7Zrf9z6EQd5ukMw=s40-c-mo" alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                        <div className="classroomDetail-card-top-right">
                            <div>Instructor</div>
                            <div>{event.createdAt}</div>
                        </div>
                    </div>
                    <div className="classroomDetail-card-bottom" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        {event.type == "reference" && event.files.length > 0 && event.files.map((file) => {
                            return <Card style={{ width: "calc(50% - 20px)", cursor: "pointer" }} key={`file-${file.id}`} onClick={() => handleDownloadFile(file)} >
                                <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                                    <img style={{ flex: "4", height: "70px", objectFit: "cover" }} src={file.fileUrl} alt="" />
                                    <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                        <div>{file.fileName}</div>
                                    </div>
                                </div>
                            </Card>
                        })}



                    </div>
                </Card>




            })}


        </div>
    </div>
}
export default ClassroomDetail;