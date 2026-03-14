import api from "./api";

export const askAIQuestion = async (question: string): Promise<string> => {
  const { data } = await api.post("/chat/ask", { question });
  return data.answer;
};