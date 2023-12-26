import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '@/contexts/ChatContext';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';
import ConfigurationBar from '../../components/ConfigurationBar';
import { getApiKey, setApiKey } from '@/utils/openai';

const Main: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, handleSendMessage } = useContext(ChatContext);

  useEffect(() => {
    // Prompt the user to enter the OpenAI API key
    if (getApiKey()) return; // API key already set (in local storage

    const apiKey = window.prompt('Please enter your OpenAI API key:');

    if (apiKey) setApiKey(apiKey);
  }, []);

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
