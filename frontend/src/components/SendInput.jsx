import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        // Input validation
        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            setError("Please enter a message");
            return;
        }
        
        if (!selectedUser?._id) {
            setError("Please select a user to send message");
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {
            const res = await axios.post(
                `${BASE_URL}/api/v1/message/send/${selectedUser._id}`, 
                { message: trimmedMessage }, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            // Update messages in Redux store
            dispatch(setMessages([...messages, res?.data?.newMessage]));
            setMessage(""); // Clear input on success
            
        } catch (error) {
            console.error("Error sending message:", error);
            
            // Set user-friendly error message
            if (error.response?.status === 401) {
                setError("Please log in to send messages");
            } else if (error.response?.status === 403) {
                setError("You don't have permission to send messages");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later");
            } else {
                setError("Failed to send message. Please try again");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmitHandler(e);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            {error && (
                <div className='mb-2 text-red-400 text-sm'>
                    {error}
                </div>
            )}
            <div className='w-full relative'>
                <input
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        if (error) setError(""); // Clear error when user starts typing
                    }}
                    onKeyPress={handleKeyPress}
                    type="text"
                    placeholder='Send a message...'
                    disabled={isLoading || !selectedUser}
                    maxLength={1000} // Reasonable message length limit
                    className={`border text-sm rounded-lg block w-full p-3 pr-12 transition-colors
                        ${isLoading || !selectedUser 
                            ? 'border-gray-400 bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'border-zinc-500 bg-gray-600 text-white hover:border-zinc-400 focus:border-blue-500 focus:outline-none'
                        }
                        ${error ? 'border-red-500' : ''}
                    `}
                    aria-label="Type your message"
                    aria-describedby={error ? "message-error" : undefined}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !message.trim() || !selectedUser}
                    className={`absolute flex inset-y-0 end-0 items-center pr-4 transition-colors
                        ${isLoading || !message.trim() || !selectedUser
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-white hover:text-blue-400'
                        }
                    `}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                    ) : (
                        <IoSend />
                    )}
                </button>
            </div>
        </form>
    )
}

export default SendInput