import React, { useEffect, useRef, useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const Messages = ({ currentUser, messages, onSendMessage, onClearMessage }) => {
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if(messages && messages.length > 0){
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };
  
  return (
    <div className="flex h-screen bg-gray-50 p-4 font-sans rounded-lg">
      <div className="flex flex-col w-full max-w-4xl h-full bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 ">
          <h2 className="text-2xl font-semibold text-gray-800">Message</h2>
          <div className="space-x-2">
            <Button
              
              className="bg-cyan-400 text-white"
            >
              New Message
            </Button>
            <Button  className="bg-cyan-400 text-white">
              New Group
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages &&
            messages.map((mes, index) => {
              return (
                <div
                  key={mes.id || index}
                  className={`mb-2 mt-2 ${mes.senderId === currentUser?.id ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg shadow-sm ${mes.senderId === currentUser?.id ? "bg-cyan-100 text-cyan-900" : "bg-white text-gray-800"}`}
                  >
                    {mes.text}
                  </div>
                </div>
              );
            })}
          <div ref={messageEndRef} />
        </div>
        <div className="p-4 bg-white">
          <Input
            icon={faMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Type your message..."}
            className="w-full py-3 pr-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            endAdornment={
              <div className="flex flex-row space-x-2">
                <Button
                  onClick={handleSend}
                  className="bg-cyan-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded-full px-5 py-2
                font-semibold text-sm transition-all active:scale-95 duration-200 shadow-sm hover:shadow-md "
                >
                  Send
                </Button>
                <Button
                  onClick={onClearMessage}
                  className="bg-cyan-500 hover:bg-gray-300 hover:cursor-pointer text-white rounded-full px-5 py-2
                font-semibold text-sm transition-all active:scale-95 duration-200 shadow-sm hover:shadow-md "
                >
                  Clear
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;
