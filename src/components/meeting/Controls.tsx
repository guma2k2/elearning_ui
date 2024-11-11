import { useMeeting } from "@videosdk.live/react-sdk";
import './Controls.style.scss'
function Controls(_props: any) {
    const { leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting();
    return (
        <div className="controls-container">
            <div className="controls-left">6l7c-w9vn-kqhe</div>
            <div className="controls-middle">
                <button onClick={() => leave()}>Leave</button>
                <button onClick={() => toggleMic()}>toggleMic</button>
                <button onClick={() => toggleWebcam()}>toggleWebcam</button>
                <button onClick={() => toggleScreenShare()}>Screen Share</button>
            </div>
            <div className="controls-right">
                <button onClick={() => leave()}>Participants</button>
                <button onClick={() => leave()}>White board</button>
            </div>
        </div>
    );
}
export default Controls;