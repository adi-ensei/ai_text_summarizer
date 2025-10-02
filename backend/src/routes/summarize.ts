import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
console.log("API Key configured:", !!process.env.GEMINI_API_KEY);

router.get("/models", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models?key=" +
        process.env.GEMINI_API_KEY
    );
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

interface SummarizeRequest {
  text: string;
  length?: "short" | "medium" | "long";
}

router.post(
  "/summarize",
  async (req: Request<{}, {}, SummarizeRequest>, res: Response) => {
    try {
      const { text, length = "medium" } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: "Text is required" });
      }

      if (text.length > 50000) {
        return res
          .status(400)
          .json({ error: "Text is too long. Maximum 50,000 characters." });
      }

      const lengthInstructions: Record<"short" | "medium" | "long", string> = {
        short: "in 2-3 sentences",
        medium: "in 5-7 sentences",
        long: "in 10-12 sentences",
      };

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Please summarize the following text ${lengthInstructions[length]}. Focus on the main points and key information:\n\n${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      res.json({ summary });
    } catch (error: any) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Failed to generate summary",
        message: error.message,
      });
    }
  }
);

export default router;
