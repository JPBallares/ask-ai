import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  text: string;
  isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isSender }) => {
  return (
    <div
      className={`p-2 whitespace-pre-wrap rounded-lg border ${isSender ? 'bg-green-500 text-white self-end' : 'bg-gray-200 text-black self-start'
        }`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default Message;
