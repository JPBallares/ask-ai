'use client';

import { ChatProvider } from '@/contexts/ChatContext';
import ImageContainer from '@/containers/ImageContainer';

export default function Image() {
  return (
    <ChatProvider>
      <ImageContainer />
    </ChatProvider>
  );
}
