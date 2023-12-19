import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });


export const chat = async (system: string, messages: string[]) => {
  const system_message = { role: "system", content: system };
  const user_message = messages.map((message, index) => ({
    role: index % 2 ? "assistant" : "user",
    content: message,
  }));
  const completion = await openai.chat.completions.create({
    messages: [system_message, ...user_message] as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content;
}
