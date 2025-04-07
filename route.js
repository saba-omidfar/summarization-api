
import { OpenAI } from "openai";
import express from "express";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/summarize", async (req, res) => {
  try {
    const { comments } = req.body;

    if (!comments || !Array.isArray(comments)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const combinedComments = comments
      .map(
        (comment) => `
        نظر: ${comment.commentBody}
        نقاط قوت: ${comment.commentAdvantages}
        نقاط ضعف: ${comment.commentDisadvantages}
      `
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "شما یک دستیار هوشمند هستید که نظرات کاربران را خلاصه کرده و مهم‌ترین نقاط قوت و ضعف را استخراج می‌کنید.",
        },
        {
          role: "user",
          content: `
            این‌ها نظرات مشتریان هستند. لطفاً موارد زیر را ارائه دهید:

            1. خلاصه‌ای کلی از تمام نظرات با عنوان 'commentSummaryOverView'
            2. سه نقطه قوت مهم با عنوان 'commentSummaryAdvantages'
            3. سه نقطه ضعف مهم با عنوان 'commentSummaryDisadvantages'

            نظرات:
            ${combinedComments}
          `,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    const parsedSummary = summary.split("\n\n");

    const commentSummaryOverView = parsedSummary[0];
    const commentSummaryAdvantages = parsedSummary[1]?.split("\n").slice(1).map(item => item.trim());
    const commentSummaryDisadvantages = parsedSummary[2]?.split("\n").slice(1).map(item => item.trim());

    res.json({
      commentSummaryOverView,
      commentSummaryAdvantages,
      commentSummaryDisadvantages,
    });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({
      error: "Error processing the comments",
      details: error.message,
    });
  }
});

export default router;
