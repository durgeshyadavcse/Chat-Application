import { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
    const {socket} = useSelector(store=>store.socket);
    const {messages} = useSelector(store=>store.message);
    const {selectedUser, authUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        console.log("🔥 Socket connected:", socket?.connected);
        console.log("👤 Auth User:", authUser?._id);
        console.log("📱 Selected User:", selectedUser?._id);
        
        const handleNewMessage = (newMessage) => {
            console.log("=== NEW MESSAGE RECEIVED ===");
            console.log("📨 Message:", newMessage);
            console.log("📤 Sender ID:", newMessage.senderId);
            console.log("📥 Receiver ID:", newMessage.receiverId);
            console.log("👤 Auth User ID:", authUser?._id);
            console.log("📱 Selected User ID:", selectedUser?._id);
            
            // Check if message belongs to current conversation
            const isMessageForCurrentConversation = 
                (newMessage.senderId === selectedUser?._id && newMessage.receiverId === authUser?._id) ||
                (newMessage.senderId === authUser?._id && newMessage.receiverId === selectedUser?._id);
            
            console.log("✅ Should show in current chat:", isMessageForCurrentConversation);
            console.log("📋 Current messages count:", messages?.length || 0);
            
            if (isMessageForCurrentConversation) {
                const updatedMessages = [...(messages || []), newMessage];
                console.log("🔄 Updating messages:", updatedMessages.length);
                dispatch(setMessages(updatedMessages));
            } else {
                console.log("❌ Message ignored - not for current conversation");
            }
        };

        if (socket) {
            socket.on("newMessage", handleNewMessage);
            console.log("🎧 Socket listener attached");
        }
        
        return () => {
            if (socket) {
                socket.off("newMessage", handleNewMessage);
                console.log("🔌 Socket listener removed");
            }
        };
    }, [socket, messages, selectedUser?._id, authUser?._id, dispatch]);
};

export default useGetRealTimeMessage;