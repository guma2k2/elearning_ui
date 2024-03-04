import { Button } from 'antd';
import './Arrow.style.scss'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
type Props = {
    type: "next" | "prev"
    handleSlideToShow: (type: string) => void
}
function Arrow(props: Props) {
    const { type, handleSlideToShow } = props;
    return (
        <Button
            onClick={() => handleSlideToShow(type)}
            className="arrow-container"
            style={{ [type === "next" ? "right" : "next"]: type === "next" ? "50px" : "0" }}
        >
            {type == "prev" ? <MdOutlineKeyboardArrowLeft className='icon' /> : <MdOutlineKeyboardArrowRight className='icon' />}
        </Button>
    );
}

export default Arrow