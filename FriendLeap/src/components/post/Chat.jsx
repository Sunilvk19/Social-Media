import axios from "axios";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import Messages from "./Messages";
import { getMockUsers } from "../../services/Mock"; 
import { getRealUsers } from "../../services/User";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const user = await localforage.getItem("Current_user");
        if (!user) return;
        setCurrentUser(user);

        const followingState = (await localforage.getItem(`Following_state_${user.id}`)) || {};
        
        const [mockUsers, realUsers] = await Promise.all([
          getMockUsers(),
          getRealUsers(),
        ])

        const allUsers = [...realUsers, ...mockUsers.users] || [];

        const followed = allUsers.filter((u) => followingState[u.id.toString()] === true);
        
        setFollowedUsers(followed);

        // if (followed.length > 0) {
        //   setSelectedUser(followed[0]);
        // }
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChatData();
  }, []);


  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    let isMounted = true;
    let timeoutId;

    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/messages");
        
        if (isMounted) {
          const filteredChat = res.data.filter((m) => 
            (m.senderId?.toString() === currentUser.id.toString() && m.receiverId?.toString() === selectedUser.id.toString()) ||
            (m.senderId?.toString() === selectedUser.id.toString() && m.receiverId?.toString() === currentUser.id.toString())
          );

          setMessages(filteredChat);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        if (isMounted) {
          timeoutId = setTimeout(fetchMessages, 3000);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [currentUser, selectedUser]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentUser || !selectedUser) return;

    const newMessage = {
      text: text,
      senderId: currentUser.id,
      receiverId: selectedUser.id, // Targeted message
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post("http://localhost:5000/messages", newMessage);
      setMessages((prev) => [...prev, res.data]);
    } catch (er) {
      console.error("Send error:", er.message);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Clear this conversation?")) return;
    try {
      for (const mes of messages) {
        await axios.delete(`http://localhost:5000/messages/${mes.id}`);
      }
      setMessages([]);
    } catch (error) {
      console.error("Clear error", error.message);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Conversations...</div>;

  return (
    <Messages
      currentUser={currentUser}
      messages={messages}
      followedUsers={followedUsers}
      selectedUser={selectedUser}
      onSelectUser={setSelectedUser}
      onSendMessage={handleSendMessage}
      onClearMessage={handleClearChat}
    />
  );
};

export default Chat;