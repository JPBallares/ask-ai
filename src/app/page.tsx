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
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      <Sidebar></Sidebar>
      <main
        className="flex flex-1 flex-col p-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-5xl w-full">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as IModel)}
            className="w-full border rounded-md p-2 dark:text-black mb-2"
          >
            {gptModelsKeys.map((modelKey) => (
              <option key={modelKey} value={modelKey}>
                {modelKey}
              </option>
            ))}
          </select>
          <textarea
            rows={1}
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            className="w-full border rounded-md p-2 resize-none dark:text-black max-h-32"
          />
        </div>
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-auto max-w-5xl w-full"
        >
          <MessageList messages={messages} />
        </div>
        <div className="max-w-5xl w-full mt-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
