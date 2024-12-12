import { Button } from "antd";
import { ILecture } from "../../types/CourseType";
import { FaPlus } from "react-icons/fa6";
import { convertSecondToMinute } from "../../utils/Format";
import { Dispatch, SetStateAction } from "react";

type Prop = {
    curriculum: ILecture,
    setOpen: Dispatch<SetStateAction<boolean>>,
    watchingSecond: number
}
function LectureContent(props: Prop) {
    const { curriculum, setOpen, watchingSecond } = props
    return <>
        <div className="learning-curriculum-info-top">
            <h2 className='learning-curriculum-title'>{curriculum?.title}</h2>
            <Button onClick={() => setOpen(true)}>
                <FaPlus />
                <span>Thêm ghi chú tại {convertSecondToMinute(watchingSecond)}</span>
            </Button>
        </div>


        <div className='learning-curriculum-time'>Cập nhật {curriculum?.updatedAt}</div>
        <div className='learning-curriculum-footer'>Made with Powered by NDT</div>
    </>
}

export default LectureContent;