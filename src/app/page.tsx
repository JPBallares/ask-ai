'use client';

import { ChatProvider } from '@/contexts/ChatContext';
import Main from '@/containers/ChatContainer';

export default function Chat() {
  return (
    <ChatProvider>
      <Main />
    </ChatProvider>
  );
}
