import axios from "axios";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import Messages from "./Messages";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      const user = await localforage.getItem("Current_user");
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/messages");
        
        if (isMounted) {
          setMessages((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(res.data)) {
              return res.data;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error(error.message);
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
  }, []);



  const handleMessages = async (text) => {
    console.log("1. Sending message: ", text);
    console.log("2. Current User data is: ", currentUser);

    if (!text.trim()) {
      console.log("Aborting: Text is empty");
      return;
    }

    if (!currentUser) {
      alert("Error: You are not properly logged in! currentUser is null.");
      console.error("Aborting: currentUser is null. Did you login first?");
      return;
    }

    const newMessages = {
      text: text,
      senderId: currentUser.id,
      receiverId: "group",
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/messages",
        newMessages,
      );
      console.log("3. Message successfully sent to DB:", res.data);
      setMessages((prev) => [...prev, res.data]);
    } catch (er) {
      console.error("4. Error from JSON server:", er.message);
    }
  };

  const handleClearMessage = async () => {
    try {
      for (const mes of messages) {
        await axios.delete(`http://localhost:5000/messages/${mes.id}`);
      }
      setMessages([]);
    } catch (error) {
      console.error("Error clearing message", error.message);
    }
  };
  return (
    <Messages
      currentUser={currentUser}
      messages={messages}
      onSendMessage={handleMessages}
      onClearMessage={handleClearMessage}
    />
  );
};

export default Chat;
