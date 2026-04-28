import React, { useEffect, useRef, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import {
  faMessage,
  faSearch,
  faEllipsisVertical,
  faPaperclip,
  faFaceSmile,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Messages = ({
  currentUser,
  messages,
  followedUsers,
  selectedUser,
  onSelectUser,
  onSendMessage,
  onClearMessage,
}) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const filteredUsers = followedUsers.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

 return (
  <div className="flex flex-col h-screen bg-[#F8FAFC] p-4 md:p-6 gap-4 overflow-hidden font-sans">
    
    {/* --- TOP NAVIGATION BAR --- */}
    <div className="flex items-center justify-between px-2">
      <button 
        onClick={() => navigate("/home")} 
        className="group flex items-center gap-2 text-gray-500 bg-white border border-gray-200/60 px-4 py-2.5 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all duration-300 font-bold uppercase tracking-widest text-[10px] shadow-sm active:scale-95"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> 
        Back to Home
      </button>
      
      {/* Optional: User status or page indicator */}
      <div className="hidden md:block text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        End-to-End Encrypted
      </div>
    </div>

    {/* --- MAIN CHAT INTERFACE --- */}
    <div className="flex flex-1 gap-6 overflow-hidden">
      
      {/* LEFT SIDEBAR: CONTACTS */}
      <div className="w-80 lg:w-96 flex flex-col bg-white rounded-[32px] shadow-xl shadow-indigo-100/20 border border-gray-100 overflow-hidden">
        <div className="p-6 pb-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Messages
            </h2>
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
              <FontAwesomeIcon icon={faMessage} />
            </div>
          </div>

          <div className="relative group">
            <Input
              icon={faSearch}
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-2xl border-gray-100 bg-gray-50/80 py-3 group-focus-within:bg-white group-focus-within:ring-4 group-focus-within:ring-indigo-500/5 transition-all shadow-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`group relative flex items-center gap-4 p-4 rounded-[24px] cursor-pointer transition-all duration-300 ${
                    selectedUser?.id === user.id
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-0.5"
                      : "hover:bg-gray-50 text-gray-700 hover:translate-x-1"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className={`w-12 h-12 rounded-2xl object-cover border-2 shadow-sm transition-transform group-hover:scale-105 ${
                        selectedUser?.id === user.id ? "border-indigo-400" : "border-white"
                      }`}
                      alt="Avatar"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate text-sm ${selectedUser?.id === user.id ? "text-white" : "text-gray-900"}`}>
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className={`text-[11px] truncate font-medium ${selectedUser?.id === user.id ? "text-indigo-100/80" : "text-gray-400"}`}>
                      {selectedUser?.id === user.id ? "Active now" : "Tap to chat"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 text-xs font-bold uppercase tracking-widest">
              No results found
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-white rounded-[32px] shadow-xl shadow-indigo-100/20 border border-gray-100 overflow-hidden relative">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="px-8 py-4 flex items-center justify-between border-b border-gray-50/80 bg-white/90 backdrop-blur-xl sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-50 shadow-sm"
                  alt=""
                />
                <div>
                  <h2 className="text-md font-black text-gray-900 tracking-tight">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={onClearMessage}
                  className="w-10 h-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border-none shadow-none"
                  icon={faTrash}
                />
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFDFF] custom-scrollbar">
              {messages.map((mes) => {
                const isMine = mes.senderId.toString() === currentUser?.id.toString();
                return (
                  <div key={mes.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[75%]`}>
                      <div className={`px-5 py-3 rounded-[22px] text-sm leading-relaxed shadow-sm ${
                        isMine 
                          ? "bg-indigo-600 text-white rounded-tr-none" 
                          : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      }`}>
                        {mes.text}
                      </div>
                      <span className="text-[9px] mt-1 font-bold text-gray-400 uppercase tracking-tighter">
                        {new Date(mes.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-1.5 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write something..."
                  className="flex-1 bg-transparent border-none py-3 px-4 text-gray-800 text-sm focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-indigo-200 transition-all font-bold text-xs"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
             <div className="w-24 h-24 bg-indigo-50 rounded-[40px] flex items-center justify-center text-indigo-500 mb-6">
                <FontAwesomeIcon icon={faMessage} size="2x" className="opacity-50" />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">Your Workspace</h3>
             <p className="text-gray-400 text-sm font-medium max-w-[240px]">
               Select a friend from the left sidebar to start messaging.
             </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Messages;