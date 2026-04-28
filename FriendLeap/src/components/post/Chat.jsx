import axios from "axios";
import localforage from "localforage";
import React, { useEffect, useState, useCallback } from "react";
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

        const [followingStateRaw, mockRes, realUsersData] = await Promise.all([
          localforage.getItem(`Following_state_${user.id}`),
          getMockUsers(),
          getRealUsers(),
        ]);

        const followingState = followingStateRaw || {};
        const mockUsers = mockRes?.users || [];
        const realUsers = Array.isArray(realUsersData) ? realUsersData : [];
        
        const allUsers = [...realUsers, ...mockUsers];
        const uniqueFollowed = allUsers.filter((u, i, self) => 
          self.findIndex(t => t.id.toString() === u.id.toString()) === i && 
          u.id.toString() !== user.id.toString() && 
          followingState[u.id.toString()] === true
        );
        
        const displayUsers = [...uniqueFollowed].reverse();
        setFollowedUsers(displayUsers);

        if (displayUsers.length > 0 && !selectedUser) {
          setSelectedUser(displayUsers[0]);
        }
        
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Optimized Polling (Server-side filtering)
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    let isMounted = true;
    let timeoutId;

    const fetchMessages = async () => {
      try {
        // Fetch only relevant messages using json-server filters for efficiency
        const [sent, received] = await Promise.all([
          axios.get(`http://localhost:5000/messages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`),
          axios.get(`http://localhost:5000/messages?senderId=${selectedUser.id}&receiverId=${currentUser.id}`)
        ]);
        
        if (isMounted) {
          // Combine and sort by timestamp
          const combined = [...sent.data, ...received.data].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
          setMessages(combined);
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

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || !currentUser || !selectedUser) return;

    const newMessage = {
      text,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post("http://localhost:5000/messages", newMessage);
      // Immediately update local state for better responsiveness
      setMessages((prev) => [...prev, res.data]);
    } catch (er) {
      console.error("Send error:", er.message);
    }
  }, [currentUser, selectedUser]);

  const handleClearChat = useCallback(async () => {
    if (!window.confirm("Clear this conversation?")) return;
    try {
      // Parallel deletions for speed
      await Promise.all(messages.map(mes => 
        axios.delete(`http://localhost:5000/messages/${mes.id}`)
      ));
      setMessages([]);
    } catch (error) {
      console.error("Clear error", error.message);
    }
  }, [messages]);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Conversations...</div>;

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