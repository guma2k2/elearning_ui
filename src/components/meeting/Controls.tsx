import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { IoVideocamOffSharp } from "react-icons/io5";
import { TbDeviceImacShare } from "react-icons/tb";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { IoMdPeople } from "react-icons/io";
import './Controls.style.scss'
import { FaRegClipboard } from "react-icons/fa6";
import { ToggleType } from "./MeetingView";
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { MdOutlineChat } from "react-icons/md";
type ControlsPropsType = {
    meetingId: string
    toggleRight: ToggleType;
    setToggleRight: Dispatch<SetStateAction<ToggleType>>
}
function Controls(props: ControlsPropsType) {
    const { meetingId, toggleRight, setToggleRight } = props;
    const { auth } = useAppSelector((state: RootState) => state.auth);


    const getCurrentId = (): string => {
        if (auth) {
            if (auth.user.role == "ROLE_STUDENT") {
                return `student-${auth.user.id}`
            }
            return `instructor-${auth.user.id}`
        }
        return ""
    }
    const { leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting();
    const { webcamOn, micOn } = useParticipant(getCurrentId())
    const handleToggleRight = (prop: "board" | "participants" | "chat") => {
        setToggleRight({ type: prop })
    }
    return (
        <div className="controls-container">
            <div className="controls-left">{meetingId}</div>
            <div className="controls-middle">
                <div className="controls-item" onClick={() => toggleMic()}>{micOn ? <FaMicrophone className="controls-icon" /> : <FaMicrophoneSlash className="controls-icon" />}</div>
                <div className="controls-item" onClick={() => toggleWebcam()}>{webcamOn ? <IoMdVideocam className="controls-icon" /> : <IoVideocamOffSharp className="controls-icon" />}</div>
                <div className="controls-item" onClick={() => toggleScreenShare()}><TbDeviceImacShare className="controls-icon" /></div>
                <div className="controls-item" onClick={() => leave()}><PiPhoneDisconnectFill className="controls-icon" /></div>

            </div>
            <div className="controls-right">
                <div onClick={() => handleToggleRight("participants")} className={toggleRight.type == "participants" ? "controls-item active" : "controls-item"}><IoMdPeople className="controls-icon" /></div>
                <div onClick={() => handleToggleRight("board")} className={toggleRight.type == "board" ? "controls-item active" : "controls-item"}><FaRegClipboard className="controls-icon" /></div>
                <div onClick={() => handleToggleRight("chat")} className={toggleRight.type == "chat" ? "controls-item active" : "controls-item"}><MdOutlineChat className="controls-icon" /></div>
            </div>
        </div>
    );
}
export default Controls;