import React from 'react';

interface MessageProps {
  text: string;
  isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isSender }) => {
  return (
    <div
      className={`p-2 rounded-lg border ${isSender ? 'bg-green-500 text-white self-end' : 'bg-gray-200 text-black self-start'
        }`}
    >
      {text}
    </div>
  );
};

export default Message;
