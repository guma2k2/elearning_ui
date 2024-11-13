// This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIzZmJjMWVmOS0wOGQzLTQwMTUtYjUxNC05YWVlMDYzYTk0YzQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczMTE3MDM3NywiZXhwIjoxNzMzNzYyMzc3fQ.76xDzEg0f3cOIoNLtZ6_AB509ynN_QkOsnxkpuAJ5vA";

interface CreateMeetingParams {
    token: string;
}

interface CreateMeetingResponse {
    roomId: string;
}

// API call to create a meeting
export const createMeeting = async ({ token }: CreateMeetingParams): Promise<string> => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    // Destructuring the roomId from the response
    const { roomId }: CreateMeetingResponse = await res.json();
    return roomId;
};
