import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

export default PresenterView