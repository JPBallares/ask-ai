// MessageInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
}) => {
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

  // Auto-expand textarea height as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="flex flex-row">
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
        Send
      </button>
    </div>
  );
};

export default MessageInput;
