import React, { useEffect } from 'react'
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const useGetMessages = () => {
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedUser?._id) {
                    axios.defaults.withCredentials = true;
                    const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser?._id}`);
                    dispatch(setMessages(res.data || [])); // Empty array if no messages
                } else {
                    // Clear messages when no user selected
                    dispatch(setMessages([]));
                }
            } catch (error) {
                console.log(error);
                dispatch(setMessages([])); // Clear messages on error
            }
        }
        fetchMessages();
    }, [selectedUser?._id, dispatch]); // Remove setMessages from dependency
}

export default useGetMessages