import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";
import PresenterView from "./PresenterView";

import { LoadingOutlined } from '@ant-design/icons';
interface MeetingViewProps {
    meetingId: string;
    onMeetingLeave: () => void;
}
import './MeetingView.style.scss'
import { Spin } from "antd";
import Chat from "../chat";
import Whiteboard from "../whiteboard";

export type ToggleType = {
    type: "participants" | "board" | "chat"
}

function MeetingView({ meetingId, onMeetingLeave }: MeetingViewProps) {
    const [joined, setJoined] = useState<"JOINING" | "JOINED" | null>(null);
    const [toggleRight, setToggleRight] = useState<ToggleType>({ type: "participants" });


    // const [toggle, setToggle] = useState<ToggleType>({ type: "" });
    function onPresenterChange(presenterId: any) {
        if (presenterId) {
            console.log(presenterId, "started screen share");
        } else {
            console.log("someone stopped screen share");
        }
    }

    // Get methods from useMeeting hook
    const { join, participants, presenterId } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
        },
        onMeetingLeft: () => {
            onMeetingLeave();
        },
        onPresenterChanged: onPresenterChange
        ,
    });

    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };


    return (
        <div className="meetingView-container">
            {joined === "JOINED" ? (
                <div>
                    <div className="meetingView-top">
                        <div className="meetingView-top-left" style={{ width: "80%" }}>
                            {presenterId && <PresenterView presenterId={presenterId} />}
                        </div>
                        {toggleRight.type == "participants" && <div className="meetingView-top-right" style={{ width: "20%" }} >
                            {[...participants.keys()].map((participantId) => (
                                <ParticipantView participantId={participantId} key={participantId} />
                            ))}
                        </div>}

                        {toggleRight.type == "board" && <div className="meetingView-top-right" style={{ width: "20%" }} >
                            <Whiteboard></Whiteboard>
                        </div>}
                        {toggleRight.type == "chat" && <div className="meetingView-top-right" style={{ width: "20%" }} >
                            <Chat roomId={meetingId} />
                        </div>}
                    </div>
                    <Controls meetingId={meetingId} toggleRight={toggleRight} setToggleRight={setToggleRight} />
                </div>
            ) : joined === "JOINING" ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
                        Joining the meeting...
                    </div>
                </div>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
        </div>
    );
}

export default MeetingView