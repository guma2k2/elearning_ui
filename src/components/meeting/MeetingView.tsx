import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";
import PresenterView from "./PresenterView";
interface MeetingViewProps {
    meetingId: string;
    onMeetingLeave: () => void;
}
import './MeetingView.style.scss'

function MeetingView({ meetingId, onMeetingLeave }: MeetingViewProps) {
    const [joined, setJoined] = useState<"JOINING" | "JOINED" | null>(null);

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
            <h3>Meeting Id: {meetingId}</h3>
            {joined === "JOINED" ? (
                <div>
                    <Controls />
                    {/* Render all participants in the meeting */}
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView participantId={participantId} key={participantId} />
                    ))}
                </div>
            ) : joined === "JOINING" ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
            {presenterId && <PresenterView presenterId={presenterId} />}
        </div>
    );
}

export default MeetingView