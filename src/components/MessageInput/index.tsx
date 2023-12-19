"use client";

import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex p-2 fixed bottom-0 left-0 right-0">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
        className="flex-grow p-2 border rounded-l-md dark:text-black"
      />
      <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r-md">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
