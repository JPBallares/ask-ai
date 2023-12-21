'use client';

import { ChatProvider } from '@/contexts/ChatContext';
import Main from '@/components/Main';

export default function Home() {
  return (
    <ChatProvider>
      <Main />
    </ChatProvider>
  );
}
