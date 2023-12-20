import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ClipboardCopy from 'clipboard-copy';

interface MessageProps {
  text: string;
  isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isSender }) => {
  const handleCopyClick = (code: string) => {
    ClipboardCopy(code);
    // Optionally, you can provide some feedback to the user that the code has been copied.
  };

  const renderCodeBlock = (language: string, code: string, index: number) => {
    return (
      <div key={index}>
        <div className="code-header flex justify-between bg-black text-white p-2 mb-0">
          <span className="language">{language}</span>
          <button onClick={() => handleCopyClick(code)} className="copy-button">
            Copy
          </button>
        </div>
        <SyntaxHighlighter language={language} style={darcula}>
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const renderSegments = () => {
    const codeMatches = text.match(/```([a-zA-Z]+)?\s*([\s\S]*?)```/g);

    if (codeMatches) {
      let currentIndex = 0;
      return codeMatches.map((codeMatch, index) => {
        const startIndex = text.indexOf(codeMatch, currentIndex);
        const endIndex = startIndex + codeMatch.length;

        const beforeCode = text.slice(currentIndex, startIndex);
        const match = codeMatch.match(/```([a-zA-Z]+)?\s*([\s\S]*?)```/);
        const language = match?.[1];
        const code = match?.[2];

        currentIndex = endIndex;

        return [
          <ReactMarkdown key={`before-${index}`}>{beforeCode}</ReactMarkdown>,
          renderCodeBlock(language || 'plaintext', code || '', index),
        ];
      }).concat([<ReactMarkdown key="rest">{text.slice(currentIndex)}</ReactMarkdown>]);
    } else {
      return <ReactMarkdown key="text">{text}</ReactMarkdown>;
    }
  };

  return (
    <div
      className={`p-2 whitespace-pre-wrap rounded-lg border ${isSender ? 'bg-green-500 text-white self-end' : 'bg-gray-200 text-black self-start'
        }`}
    >
      {renderSegments()}
    </div>
  );
};

export default Message;
