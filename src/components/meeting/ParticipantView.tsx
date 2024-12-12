import ReactPlayer from "react-player";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import { Stream } from "@videosdk.live/react-sdk/dist/types/stream";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa6";
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
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "200px",
                margin: "0 10px",
                marginBottom: "15px",
                backgroundColor: webcamOn ? "transparent" : "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {webcamOn && (
                <ReactPlayer
                    playsinline
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    height={"100%"}
                    width={"100%"}
                    style={{ objectFit: "cover", position: "absolute", top: "0", left: "0" }}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />
            )}

            <p
                style={{
                    position: "absolute",
                    bottom: "15px",
                    left: "5px",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                }}
            >
                {displayName}
            </p>

            <div
                style={{
                    position: "absolute",
                    top: "15px",
                    right: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
            >
                {micOn ? (
                    <FaMicrophone color="white" size={16} />
                ) : (
                    <FaMicrophoneSlash color="white" size={16} />
                )}
                {webcamOn ? (
                    <FaVideo color="white" size={16} />
                ) : (
                    <FaVideoSlash color="white" size={16} />
                )}
            </div>

            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        </div>
    );
}

export default ParticipantView;