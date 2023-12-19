"use client";

import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ text: string; isSender: boolean }[]>([]);

  const handleSendMessage = (text: string) => {
    setMessages([...messages, { text, isSender: true }]);
    // You can send the message to a server or handle it as needed
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
