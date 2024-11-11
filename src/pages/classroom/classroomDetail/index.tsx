import './ClassroomDetail.style.scss'
import Background from "../../../assets/img_classroom_background.jpg"
import { Card } from 'antd';
const { Meta } = Card;
function ClassroomDetail() {
    return <div className="classroomDetail-container">
        <div className="classroomDetail-top">
            <img src={Background} alt="classroom detail" />
            <div className="classroomDetail-text">
                <div className="classroomDetail-Title">Classroom title</div>
                <div className="classroomDetail-Desc">Classroom Desc</div>
            </div>
        </div>
        <div className="classroomDetail-content">

            <Card
                style={{ width: "780px", padding: "20px 40px" }}
            >
                <div className="classroomDetail-card-top" style={{ display: "flex" }}>
                    <img src="https://lh3.googleusercontent.com/a/ACg8ocLf5401BY_QkReNX4ZNaR6_hs5i0n_rgUA7Zrf9z6EQd5ukMw=s40-c-mo" alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                    <div className="classroomDetail-card-top-right">
                        <div>Hieu Nguyen Trung</div>
                        <div>3 thg 11, 2022</div>
                    </div>
                </div>
                <div className="classroomDetail-card-bottom" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <Card style={{ width: "calc(50% - 20px)" }}>
                        <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                            <img style={{ flex: "4", height: "70px", objectFit: "cover" }} src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="" />
                            <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                <div>Hieu Nguyen Trung</div>
                                <div>3 thg 11, 2022</div>
                            </div>
                        </div>
                    </Card>

                    <Card style={{ width: "calc(50% - 20px)" }}>
                        <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                            <img style={{ flex: "4", height: "70px", objectFit: "cover" }} src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="" />
                            <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                <div>Hieu Nguyen Trung</div>
                                <div>3 thg 11, 2022</div>
                            </div>
                        </div>
                    </Card>

                    <Card style={{ width: "calc(50% - 20px)" }}>
                        <div className="classroomDetail-cardBottom-container" style={{ display: "flex" }}>
                            <img style={{ flex: "4", height: "70px", objectFit: "cover" }} src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-48dp/logo_drive_2020q4_color_1x_web_48dp.png" alt="" />
                            <div style={{ flex: "6" }} className="classroomDetail-cardBottom-file-right">
                                <div>Hieu Nguyen Trung</div>
                                <div>3 thg 11, 2022</div>
                            </div>
                        </div>
                    </Card>

                </div>
            </Card>
            <Card
                style={{ width: "780px", padding: "0 40px" }}
            >
                <div className="classroomDetail-card-top" style={{ display: "flex" }}>
                    <img src="https://lh3.googleusercontent.com/a/ACg8ocLf5401BY_QkReNX4ZNaR6_hs5i0n_rgUA7Zrf9z6EQd5ukMw=s40-c-mo" alt="instructor picture" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                    <div className="classroomDetail-card-top-right">
                        <div>Hieu Nguyen Trung đã đăng một bài tập mới: Bài Lab 6 - Lập Hướng Đối Tượng INT1332</div>
                        <div>3 thg 11, 2022</div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
}
export default ClassroomDetail;