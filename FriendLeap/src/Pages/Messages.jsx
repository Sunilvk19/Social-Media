import React, { useState } from 'react'
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Messages = ({ currentUser, messages, onSendMessage }) => {
  const [input, setInput] = useState("");
  const handleSend = () => {
    if(!input.trim()) return;
    onSendMessage(input);
    setInput("");
  }
  const handleNewMessage = () => {

  }
  const handleNewGroup = () => {

  }
  return (
    <div className='flex w-full h-screen justify-center bg-gray-50 p-4 font-sans'>
      <div className='flex flex-col w-full max-w-4xl h-full bg-white rounded-xl shadow-lg border'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-2xl font-semibold text-gray-800'>Message</h2>
          <div className='space-x-2'>
              <Button className='bg-cyan-400 text-white'>New Message</Button>
              <Button className='bg-cyan-400 text-white'>New Group</Button>
          </div>
        </div>
         <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
          {messages && messages.map((mes, index)=>{
              return(
                <div key={mes.id || index} className={`mb-2 mt-2 ${mes.senderId === currentUser?.id ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-3 rounded-lg shadow-sm ${mes.senderId === currentUser?.id ? "bg-cyan-100 text-cyan-900" : "bg-white text-gray-800"}`}>
                      {mes.text}
                  </div>
                </div>
              )
          })}
        </div>
            <div className='p-4 bg-white border-t'>
            <Input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder={"Type your message..."}
              className='w-full'
              onKeyDown={(e)=>{
                if(e.key === "Enter") handleSend();
              }}
              endAdornment={
                <Button onClick={handleSend} className='bg-cyan-500 hover:bg-cyan-600 text-white'>Send</Button>
              }
            />
        </div>
      </div>
    </div>
  )
}

export default Messages