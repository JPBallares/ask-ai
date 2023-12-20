'use client';

import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';

import { useEffect, useRef, useState } from 'react';
import { chat } from '@/utils/openai';

export default function Home() {
  const [messages, setMessages] = useState<
    { text: string; isSender: boolean }[]
  >([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMessages = [...messages, { text, isSender: true }];
    setMessages(newMessages);
    setIsLoading(true);

    const res = await chat(
      "You're an expert in anything the user want you to be.",
      newMessages.map((message) => message.text),
    );
    if (res) {
      setMessages([...newMessages, { text: res, isSender: false }]);
      setIsLoading(false);
    }
  };

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
    <main
      ref={messagesContainerRef}
      className="flex min-h-screen max-h-screen overflow-auto flex-col items-center justify-between p-24"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </main>
  );
}
