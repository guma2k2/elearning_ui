import ReactPlayer from "react-player";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import { Stream } from "@videosdk.live/react-sdk/dist/types/stream";
interface ParticipantViewProps {
    participantId: string;
}
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
                    playsinline
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

export default ParticipantView;