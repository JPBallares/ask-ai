import React, { useContext, useEffect, useRef } from 'react';
import Sidebar from '../Sidebar';
import { ChatContext } from '@/contexts/ChatContext';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import ConfigurationBar from '../ConfigurationBar';

const Main: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, handleSendMessage } = useContext(ChatContext);

  useEffect(() => {
    // Scroll to the bottom with a small delay
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex overflow-hidden text-slate-500 dark:text-slate-400">
      <Sidebar></Sidebar>
      <main
        className="flex h-screen w-full flex-col flex-wrap bg-white dark:bg-slate-900"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          ref={messagesContainerRef}
          className="flex-1 flex flex-row overflow-auto p-2"
        >
          <div className="flex-1 ">
            <MessageList messages={messages} />
          </div>
          <ConfigurationBar />
        </div>

        <div className="w-full p-2">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Main;
