import React, { useEffect, useRef, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const Messages = ({ 
  currentUser, 
  messages, 
  followedUsers, 
  selectedUser, 
  onSelectUser, 
  onSendMessage, 
  onClearMessage 
}) => {
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4 font-sans gap-4">
      <div className="w-80 h-full bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200">
        <div className="p-5 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {followedUsers.length > 0 ? (
            followedUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-l-4 ${
                  selectedUser?.id === user.id 
                    ? "bg-cyan-50 border-cyan-500" 
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <img 
                  src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                  alt="Avatar"
                />
                <div className="flex-1 truncate">
                  <h4 className="font-bold text-gray-800 text-sm">{user.firstName} {user.lastName}</h4>
                  <p className="text-xs text-gray-500 truncate">Tap to chat</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center">
              <p className="text-gray-400 text-sm">Follow someone on the Home page to start a chat!</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {selectedUser ? (
          <>
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <img src={selectedUser.image} className="w-10 h-10 rounded-full border" alt="" />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedUser.firstName} {selectedUser.lastName}</h2>
                  <span className="text-xs text-green-500 font-medium">● Online</span>
                </div>
              </div>
              <Button onClick={onClearMessage} className="bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 text-xs py-1 px-4">
                Clear Chat
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {messages.map((mes, index) => (
                <div
                  key={mes.id || index}
                  className={`flex ${mes.senderId.toString() === currentUser?.id.toString() ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
                      mes.senderId.toString() === currentUser?.id.toString()
                        ? "bg-cyan-500 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    {mes.text}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <Input
                icon={faMessage}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${selectedUser.firstName}...`}
                className="w-full py-3 pr-20"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                endAdornment={
                  <Button
                    onClick={handleSend}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6 py-2 shadow-md transition-transform active:scale-95"
                  >
                    Send
                  </Button>
                }
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <FontAwesomeIcon icon={faMessage} className="text-3xl" />
            </div>
            <p>Select a friend to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
