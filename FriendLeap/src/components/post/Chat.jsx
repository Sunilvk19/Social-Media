import axios from "axios";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import Messages from "../../Pages/Messages";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      const user = await localforage.getItem("user");
      setCurrentUser(user);
    };
    loadUser();
  }, []);
  useEffect(() => {
      const fetchMessages = async () => {
        try{
            const res = await axios.get("http://localhost:5000/messages");
            setMessages(res.data);
        } catch (error){
            console.error(error.message);
        }
      };
      fetchMessages();
  }, []);

  const handleMessages = async (text) => {
    if (!text.trim() || !currentUser) return;
    const newMessages = {
        text: text,
        senderId: currentUser.id,
        receiverId: "user",
        timestamp: new Date().toISOString(),
    };
    try{
        const res = await axios.post("http://localhost:5000/messages", newMessages);
        setMessages([...messages, res.data]);
    }catch(er){
        console.error(er.message);
    }
  };
  return (
    <>
        <Messages 
        currentUser={currentUser}
        messages={messages}
        onSendMessage={handleMessages}
        />
    </>
  )
};

export default Chat;
