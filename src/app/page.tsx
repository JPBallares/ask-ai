"use client";

import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";

import { useState } from "react";
import { chat } from "@/utils/openai";


export default function Home() {
  const [messages, setMessages] = useState<{ text: string; isSender: boolean }[]>([]);

  const handleSendMessage = async (text: string) => {
    const newMessages = [...messages, { text, isSender: true }];
    const res = await chat("You're an expert in anything the user want you to be.", newMessages.map((message) => message.text));

    if (res) {
      setMessages([...newMessages, { text: res, isSender: false }]);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
}
