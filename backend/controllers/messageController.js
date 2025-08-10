import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // Validate required fields
        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message content is required and cannot be empty'
            });
        }

        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: 'Sender ID is required (authentication issue)'
            });
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID is required'
            });
        }

        // Find or create conversation
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message.trim()
        });

        // Add message to conversation
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
            await gotConversation.save();
        }

        // SOCKET IO - emit to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.error('Error in sendMessage:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        // Validate required fields
        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: 'Sender ID is required (authentication issue)'
            });
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID is required'
            });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        return res.status(200).json({
            success: true,
            messages: conversation?.messages || []
        });

    } catch (error) {
        console.error('Error in getMessage:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get messages',
            error: error.message
        });
    }
};