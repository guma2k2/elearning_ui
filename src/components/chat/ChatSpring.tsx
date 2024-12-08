import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";

interface Message {
    sender: string;
    content: string;
}


const ChatSpring: React.FC = () => {

    const { roomId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState("");
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: "ws://localhost:8080/ws", // WebSocket URL for direct connections
            // debug: (str) => console.log(str),
            reconnectDelay: 5000, // Reconnect on failure
        });

        stompClient.onConnect = () => {
            console.log("Connected to WebSocket!");
            stompClient.subscribe(`/topic/rooms/${roomId}`, (message) => {
                const newMsg = JSON.parse(message.body) as Message;
                setMessages((prev) => [...prev, newMsg]); // Add new message to the state
            });
        };

        stompClient.onStompError = (error) => {
            console.error("WebSocket Error:", error);
        };

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate(); // Clean up the connection on unmount
        };
    }, []);

    const sendMessage = () => {
        if (!newMessage || !username) return;

        const message: Message = { sender: username, content: newMessage };

        if (client?.connected) {
            client.publish({
                destination: `/app/chat/${roomId}`, // Matches the backend @MessageMapping endpoint
                body: JSON.stringify(message),
            });
            setNewMessage(""); // Clear the input after sending
        } else {
            console.error("STOMP client is not connected!");
        }
    };


    return (
        <div>
            <h1>Chat Room: {roomId}</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Enter your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatSpring;
