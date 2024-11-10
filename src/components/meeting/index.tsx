import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./meetingConfig";
import ReactPlayer from "react-player";
import { Stream } from "@videosdk.live/react-sdk/dist/types/stream";
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

// Placeholder components for ParticipantView and Controls
function ParticipantView(prop: ParticipantViewProps) {
    const micRef = useRef<HTMLAudioElement | null>(null);

    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName, } = useParticipant(prop.participantId, {
        onStreamEnabled,
        onStreamDisabled,
    });

    const videoStream = useMemo<MediaStream | undefined>(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
        return undefined;
    }, [webcamStream, webcamOn]);


    function onStreamEnabled(stream: Stream) {
        if (stream.kind === 'share') {
            console.log("Share Stream On: onStreamEnabled", stream);
        }
    }

    //Callback for when the participant stops a stream
    function onStreamDisabled(stream: Stream) {
        if (stream.kind === 'share') {
            console.log("Share Stream Off: onStreamDisabled", stream);
        }
    }

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("micRef.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div>
            <p>
                Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
                {micOn ? "ON" : "OFF"}
            </p>
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
            {webcamOn && (
                <ReactPlayer
                    playsinline // extremely crucial prop
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    height={"300px"}
                    width={"300px"}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />
            )}
        </div>
    );
}

function Controls(props: any) {
    const { leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting();
    return (
        <div>
            <button onClick={() => leave()}>Leave</button>
            <button onClick={() => toggleMic()}>toggleMic</button>
            <button onClick={() => toggleWebcam()}>toggleWebcam</button>
            <button onClick={() => toggleScreenShare()}>Screen Share</button>
        </div>
    );
}
interface PresenterViewProps {
    presenterId: string;
}


function PresenterView({ presenterId }: PresenterViewProps) {
    // Get screen share stream and screen share status
    const { screenShareStream, screenShareOn } = useParticipant(presenterId);

    // Creating a media stream from the screen share stream
    const mediaStream = useMemo(() => {
        if (screenShareOn && screenShareStream) {
            const stream = new MediaStream();
            stream.addTrack(screenShareStream.track);
            return stream;
        }
        return null;
    }, [screenShareStream, screenShareOn]);

    return (
        <>
            {mediaStream && (
                <ReactPlayer
                    playsinline // extremely crucial prop
                    playIcon={<></>} // Optional, can customize the play icon
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={mediaStream} // Passing the mediaStream here
                    height="100%"
                    width="100%"
                    onError={(err) => {
                        console.log(err, "presenter video error");
                    }}
                />
            )}
        </>
    );
};

// MeetingView Component
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
        <div className="container">
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