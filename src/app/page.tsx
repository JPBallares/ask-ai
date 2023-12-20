'use client';

import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';

import { useEffect, useRef, useState } from 'react';
import { IModel, OpenAIChat, gptModelsKeys } from '@/utils/openai';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [messages, setMessages] = useState<
    { text: string; isSender: boolean }[]
  >([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<IModel>(gptModelsKeys[0]);
  const [system, setSystem] = useState<string>(
    "You're a senior developer at a company. You're assigned to work with the user as a pair programming partner.",
  );
  const [chat, setChat] = useState<OpenAIChat | null>(null);

  const handleSendMessage = async (text: string) => {
    const newMessages = [...messages, { text, isSender: true }];
    setMessages(newMessages);
    setIsLoading(true);

    const res = await chat?.send(newMessages.map((message) => message.text));
    if (res) {
      setMessages([...newMessages, { text: res, isSender: false }]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chat) {
      chat.model = model;
      chat.system = system;
    } else {
      setChat(new OpenAIChat(model, system));
    }
  }, [chat, model, system]);

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
        <div className="p-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as IModel)}
            className="w-full border rounded-md p-2 mb-2 dark:text-slate-300 max-h-32 bg-slate-900 border-slate-600"
          >
            {gptModelsKeys.map((modelKey) => (
              <option key={modelKey} value={modelKey}>
                {modelKey}
              </option>
            ))}
          </select>
          <textarea
            rows={2}
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            className="w-full border rounded-md p-2 resize-none dark:text-slate-300 max-h-32 bg-slate-900 border-slate-600"
          />
        </div>
        <div ref={messagesContainerRef} className="flex-1 overflow-auto p-2">
          <div className="max-w-5xl w-full">
            <MessageList messages={messages} />
          </div>
        </div>

        <div className="max-w-5xl w-full p-2">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
