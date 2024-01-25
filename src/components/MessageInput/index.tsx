// MessageInput.tsx
import { ChatContext } from '@/contexts/ChatContext';
import { clearChatMessages } from '@/utils/openai';
import React, { useState, useRef, useEffect, useContext } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  showClearButton?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
  showClearButton,
}) => {
  const { setMessages } = useContext(ChatContext);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of Enter (new line)
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (disabled) return;
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleClearMessage = () => {
    setMessages([]);
    clearChatMessages();
  };

  // Auto-expand textarea height as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="flex flex-row">
      {showClearButton && (
        <button
          className="ml-2 bg-blue-500 text-white p-2 mr-2 rounded-md"
          onClick={handleClearMessage}
        >
          Clear messages
        </button>
      )}
      <textarea
        ref={textareaRef}
        rows={1} // Start with one visible row
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-md p-2 resize-none dark:text-slate-300 max-h-32 bg-slate-900 border-slate-600"
      />
      <button
        onClick={handleSendMessage}
        className="ml-2 bg-blue-500 text-white p-2 rounded-md"
        disabled={disabled}
      >
        {disabled ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Thinking...
          </>
        ) : (
          <span>Send</span>
        )}
      </button>
    </div>
  );
};

export default MessageInput;
