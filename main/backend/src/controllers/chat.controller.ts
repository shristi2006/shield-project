import { Request, Response } from "express";
import { queryRAG } from "../services/ragService";

export const askAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question?.trim()) {
      res.status(400).json({ error: "Question cannot be empty" });
      return;
    }
    console.log("Chat hit! Question:", question);
    const answer = await queryRAG(question);
    res.json({ answer });
  } catch (err: any) {
    console.error("RAG Error:", err.message);
    res.status(500).json({ error: "AI service failed. Check your API key." });
  }
};