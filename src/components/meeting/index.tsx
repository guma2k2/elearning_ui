import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    MeetingProvider,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./meetingConfig";
import MeetingView from "./MeetingView";
interface JoinScreenProps {
    getMeetingAndToken: (id: string | null) => Promise<void>;
}

interface MeetingViewProps {
    meetingId: string;
    onMeetingLeave: () => void;
}
interface ParticipantViewProps {
    participantId: string;
}
// JoinScreen Component
function JoinScreen({ getMeetingAndToken }: JoinScreenProps) {
    const [meetingId, setMeetingId] = useState<string | null>(null);

    const onClick = async () => {
        await getMeetingAndToken(meetingId);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Meeting Id"
                onChange={(e) => setMeetingId(e.target.value)}
            />
            <button onClick={onClick}>Join</button>
            {" or "}
            <button onClick={onClick}>Create Meeting</button>
        </div>
    );
}

interface PresenterViewProps {
    presenterId: string;
}

function Meeting() {
    const [meetingId, setMeetingId] = useState<string | null>(null);

    // Function to get meeting ID and token
    const getMeetingAndToken = async (id: string | null) => {
        console.log(authToken);
        const newMeetingId = id == null ? await createMeeting({ token: authToken }) : id;
        setMeetingId(newMeetingId);
    };

    // Reset meetingId when meeting is left
    const onMeetingLeave = () => {
        setMeetingId(null);
    };

    return authToken && meetingId ? (
        <MeetingProvider
            config={{
                debugMode: false,
                meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: "C.V. Raman",

            }}
            token={authToken}
        >
            <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        </MeetingProvider>
    ) : (
        <JoinScreen getMeetingAndToken={getMeetingAndToken} />
    );
}

export default Meeting;