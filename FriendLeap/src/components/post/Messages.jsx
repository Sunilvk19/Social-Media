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

const Messages = ({
  currentUser,
  messages,
  followedUsers,
  selectedUser,
  onSelectUser,
  onSendMessage,
  onClearMessage,
}) => {
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
    <div className="flex h-[calc(100vh-80px)] bg-gray-50/50 font-sans gap-6 p-6 overflow-hidden">
      <div className="w-96 flex flex-col bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in slide-in-from-left-8 duration-700">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Messages
            </h2>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <FontAwesomeIcon icon={faMessage} />
            </div>
          </div>

          <div className="relative group">
            <Input
              icon={faSearch}
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-3 group-focus-within:bg-white transition-all shadow-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
          {filteredUsers.length > 0 ? (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedUser?.id === user.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-2"
                      : "hover:bg-indigo-50 text-gray-700 hover:translate-x-1"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        user.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-sm transition-transform group-hover:scale-105 ${
                        selectedUser?.id === user.id
                          ? "border-indigo-400"
                          : "border-white"
                      }`}
                      alt="Avatar"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4
                        className={`font-bold truncate text-[15px] ${selectedUser?.id === user.id ? "text-white" : "text-gray-900"}`}
                      >
                        {user.firstName} {user.lastName}
                      </h4>
                    </div>
                    <p
                      className={`text-xs truncate font-medium ${selectedUser?.id === user.id ? "text-indigo-100" : "text-gray-500"}`}
                    >
                      Tap to open conversation...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                {searchQuery
                  ? "No contacts found matching your search."
                  : "Follow someone to start a conversation!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        {selectedUser ? (
          <>
            <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      selectedUser.image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-50 shadow-sm"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={onClearMessage}
                  variant="ghost"
                  className="w-10 h-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border-none"
                  icon={faTrash}
                />
                <Button
                  variant="ghost"
                  className="w-10 h-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-none"
                  icon={faEllipsisVertical}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
              <div className="flex justify-center mb-8">
                <span className="px-4 py-1.5 bg-white shadow-sm border border-gray-100 rounded-full text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Today
                </span>
              </div>

              {messages.map((mes, index) => {
                const isMine =
                  mes.senderId.toString() === currentUser?.id.toString();
                return (
                  <div
                    key={mes.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[70%]`}
                    >
                      <div
                        className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                          isMine
                            ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100"
                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-gray-100"
                        }`}
                      >
                        {mes.text}
                      </div>
                      <span className="text-[10px] mt-1.5 font-bold text-gray-400 uppercase tracking-wider px-1">
                        {new Date(mes.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-gray-50">
              <div className="flex items-center gap-4 bg-gray-50/50 rounded-2xl p-2 pr-2 border border-gray-100 focus-within:border-indigo-200 focus-within:bg-white transition-all">
                <div className="flex gap-1 pl-2">
                  <button className="w-10 h-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                    <FontAwesomeIcon icon={faPaperclip} />
                  </button>
                  <button className="w-10 h-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </button>
                </div>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Type a message to ${selectedUser.firstName}...`}
                  className="flex-1 bg-transparent border-none py-3 px-2 text-gray-800 text-[15px] focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <Button
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] border-none font-bold text-sm"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-indigo-50 rounded-[40px] flex items-center justify-center text-indigo-600 transform -rotate-12 animate-pulse">
                <FontAwesomeIcon icon={faMessage} size="3x" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-500 animate-bounce duration-2000">
                <FontAwesomeIcon icon={faMessage} size="lg" />
              </div>
            </div>
            <div className="max-w-xs space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                Your Conversations
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Select a friend from the sidebar to start a new conversation or
                continue an old one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
