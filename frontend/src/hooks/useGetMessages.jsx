import { useEffect } from 'react'
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedUser?._id) {
                    axios.defaults.withCredentials = true;
                    const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser._id}`);
                    // ✅ Dispatch actual array from response
                    dispatch(setMessages(res?.data?.messages || [])); 
                } else {
                    dispatch(setMessages([]));
                }
            } catch (error) {
                console.log(error);
                dispatch(setMessages([]));
            }
        };
        fetchMessages();
    }, [selectedUser?._id, dispatch]);
}

export default useGetMessages;
