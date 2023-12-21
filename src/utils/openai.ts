import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const gptModels = {
  'gpt-4-1106-preview': {
    inputCost: 0.01,
    outputCost: 0.03,
  },
  'gpt-4': {
    inputCost: 0.03,
    outputCost: 0.06,
  },
  'gpt-4-32k': {
    inputCost: 0.06,
    outputCost: 0.12,
  },
  'gpt-3.5-turbo-1106': {
    inputCost: 0.001,
    outputCost: 0.002,
  },
  'gpt-3.5-turbo-instruct': {
    inputCost: 0.0015,
    outputCost: 0.002,
  },
};

export const gptModelsKeys: IModel[] = Object.keys(gptModels) as IModel[];

export type IModel = keyof typeof gptModels;

/**
 * Represents a chat interface for OpenAI.
 */
export class OpenAIChat {
  model: IModel;
  system: string;
  totalCosts: number;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;

  /**
   * Creates an instance of OpenAIChat.
   * @param model - The model to use for chat.
   * @param system - The system message for chat.
   */
  constructor(
    model: IModel,
    system: string,
    temperature = 0.7,
    maxTokens = 150,
    topP = 1,
    frequencyPenalty = 0.0,
    presencePenalty = 0.6,
  ) {
    this.model = model;
    this.system = system;
    this.totalCosts = 0;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.topP = topP;
    this.frequencyPenalty = frequencyPenalty;
    this.presencePenalty = presencePenalty;
  }

  toString() {
    return JSON.stringify(this);
  }

  /**
   * Sends a chat message to OpenAI and returns the response.
   * @param messages - The array of messages in the chat.
   * @returns The response from OpenAI.
   */
  async send(messages: string[]) {
    const system_message = { role: 'system', content: this.system };
    const user_message = messages.map((message, index) => ({
      role: index % 2 ? 'assistant' : 'user',
      content: message,
    }));
    const completion = await openai.chat.completions.create({
      messages: [
        system_message,
        ...user_message,
      ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      model: this.model,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
    });
    const usage = completion.usage
      ? completion.usage
      : { prompt_tokens: 0, completion_tokens: 0 };
    this.totalCosts += this.calculateCosts(
      usage.prompt_tokens,
      usage.completion_tokens,
    );
    return completion.choices[0].message.content;
  }

  /**
   * Calculate the total costs of the chat.
   * @param prompt_tokens - The number of tokens in the prompt.
   * @params completion_tokens - The number of tokens in the completion.
   * @returns The total costs of the chat.
   */
  calculateCosts(prompt_tokens: number, completion_tokens: number) {
    return (
      gptModels[this.model].inputCost * (prompt_tokens / 1000) +
      gptModels[this.model].outputCost * (completion_tokens / 1000)
    );
  }
}
