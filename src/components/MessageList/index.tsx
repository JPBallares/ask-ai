import React from 'react';
import Message from '@/components/Message';

interface MessageListProps {
  messages: { text: string; isSender: boolean }[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      {messages.map((message, index) => (
        <Message key={index} text={message.text} isSender={message.isSender} />
      ))}
    </div>
  );
};

export default MessageList;
