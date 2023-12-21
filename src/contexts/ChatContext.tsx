import { IMessage } from '@/interfaces';
import { IModel, OpenAIChat, gptModelsKeys } from '@/utils/openai';
import React, { createContext, useEffect, useState } from 'react';

interface ChatContextProps {
  messages: IMessage[];
  model: IModel;
  system: string;
  isLoading: boolean;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  chat: OpenAIChat | null;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setModel: React.Dispatch<React.SetStateAction<IModel>>;
  setSystem: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>;
  setTopP: React.Dispatch<React.SetStateAction<number>>;
  setFrequencyPenalty: React.Dispatch<React.SetStateAction<number>>;
  setPresencePenalty: React.Dispatch<React.SetStateAction<number>>;
  handleSendMessage: (text: string) => void;
}

const defaultState: ChatContextProps = {
  messages: [],
  isLoading: false,
  model: gptModelsKeys[0],
  system: '',
  chat: null,
  temperature: 0.7,
  maxTokens: 150,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  setMessages: () => {},
  setModel: () => {},
  setSystem: () => {},
  setIsLoading: () => {},
  setTemperature: () => {},
  setMaxTokens: () => {},
  setTopP: () => {},
  setFrequencyPenalty: () => {},
  setPresencePenalty: () => {},
  handleSendMessage: () => {},
};

export const ChatContext = createContext<ChatContextProps>(defaultState);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<IModel>(gptModelsKeys[0]);
  const [system, setSystem] = useState<string>(
    "You're a senior developer at a company. You're assigned to work with the user as a pair programming partner.",
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(150);
  const [topP, setTopP] = useState<number>(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0);
  const [presencePenalty, setPresencePenalty] = useState<number>(0);

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
      chat.temperature = temperature;
      chat.maxTokens = maxTokens;
      chat.topP = topP;
      chat.frequencyPenalty = frequencyPenalty;
      chat.presencePenalty = presencePenalty;
    } else {
      setChat(
        new OpenAIChat(
          model,
          system,
          temperature,
          maxTokens,
          topP,
          frequencyPenalty,
          presencePenalty,
        ),
      );
    }
  }, [
    chat,
    frequencyPenalty,
    maxTokens,
    model,
    presencePenalty,
    system,
    temperature,
    topP,
  ]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        model,
        system,
        chat,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
        setMessages,
        setIsLoading,
        setModel,
        setSystem,
        setTemperature,
        setMaxTokens,
        setTopP,
        setFrequencyPenalty,
        setPresencePenalty,
        handleSendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
