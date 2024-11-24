import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    MeetingProvider,
} from "@videosdk.live/react-sdk";
import { authToken, createMeetingCode } from "./meetingConfig";
import MeetingView from "./MeetingView";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
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
// function JoinScreen({ getMeetingAndToken }: JoinScreenProps) {
//     const [meetingId, setMeetingId] = useState<string | null>(null);

//     const onClick = async () => {
//         await getMeetingAndToken(meetingId);
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Enter Meeting Id"
//                 onChange={(e) => setMeetingId(e.target.value)}
//             />
//             <button onClick={onClick}>Join</button>
//             {" or "}
//             <button onClick={onClick}>Create Meeting</button>
//         </div>
//     );
// }

interface PresenterViewProps {
    presenterId: string;
}

function Meeting() {
    let { meetingId } = useParams();
    const navigate = useNavigate();

    // const [meetingId, setMeetingId] = useState<string | null>(null);

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

    // Function to get meeting ID and token
    // const getMeetingAndToken = async (id: string | null) => {
    //     console.log(authToken);
    //     const newMeetingId = id == null ? await createMeeting({ token: authToken }) : id;
    //     setMeetingId(newMeetingId);
    // };

    // Reset meetingId when meeting is left
    const onMeetingLeave = () => {
        navigate("/my-learning")
    };

    return authToken && meetingId && (
        <MeetingProvider
            config={{
                debugMode: false,
                meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: auth?.user ? auth.user.email : "Participant name",
                participantId: getCurrentId()
            }}
            token={authToken}
        >
            <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        </MeetingProvider>
    )
}

export default Meeting;