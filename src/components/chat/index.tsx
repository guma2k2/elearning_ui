import React, { useState, useEffect, useRef } from 'react';
import { database } from '../../utils/firebase'; // Replace with your Firebase setup
import { ref, push, onValue } from 'firebase/database';
import { LoginResponse } from '../../types/AuthType';
import './Chat.style.scss'
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

type ChatProps = {
    roomId: string;
};

type MessageType = {
    id: string;
    userId: number;
    message: string;
    timestamp: string;
    email: string;
    photoURL?: string;
};

const Chat: React.FC<ChatProps> = ({ roomId }) => {


    const { auth } = useAppSelector((state: RootState) => state.auth);


    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom of the messages container when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]); // This ensures scroll happens every time messages are updated

    // Fetch messages from Firebase
    useEffect(() => {
        const messagesRef = ref(database, `rooms/${roomId}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messagesArray = data
                ? Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }))
                : [];
            setMessages(messagesArray);
        });
        return () => unsubscribe();
    }, [roomId]);

    // Send new message to Firebase
    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const messagesRef = ref(database, `rooms/${roomId}/messages`);
        const timestamp = new Date().toISOString();

        push(messagesRef, {
            userId: auth?.user.id,
            message: newMessage,
            timestamp,
            email: auth?.user.email,
            photoURL: auth?.user.photoURL,
        })
            .then(() => {
                console.log("Message sent successfully!");
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });

        setNewMessage('');
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.userId === auth?.user.id ? 'own' : ''}`}>
                        <img src={msg.photoURL || '/default-avatar.png'} alt="User" className="avatar" />
                        <div className="message-content">
                            <span className="user-name">{msg.email}</span>
                            <span className="message-text">{msg.message}</span>
                            <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Ref to help scroll to the bottom */}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
