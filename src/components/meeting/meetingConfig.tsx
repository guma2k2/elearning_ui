// This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIzZmJjMWVmOS0wOGQzLTQwMTUtYjUxNC05YWVlMDYzYTk0YzQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczMjUxMjgyMywiZXhwIjoxNzM1MTA0ODIzfQ.NB4yaWKwaNG998Z5QDe69bkY8g_UL60WIMXC7Kqwoxw";

interface CreateMeetingParams {
    token: string;
}

interface CreateMeetingResponse {
    roomId: string;
}

// API call to create a meeting
export const createMeetingCode = async ({ token }: CreateMeetingParams): Promise<string> => {
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
