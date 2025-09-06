import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function askAI(history: Message[], userName: string) {
  const systemMessage = {
    role: "system",
    content: `Você é um assistente amigável e profissional de Pet Shop. Converse de forma humana, oferecendo atendimento, agendamento de serviços, lembretes e sugestões de produtos.`
  };

  const messages = [systemMessage, ...history];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 300
  });

  return response.choices[0].message?.content || "Desculpe, não entendi.";
}
