import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PostStyle } from "../types/post";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateLinkedInPost(article: {
  title: string;
  content: string;
  style: PostStyle;
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  let styleInstructions = "";

  if (article.style === "professional") {
    styleInstructions = `
Use a professional business tone.
Focus on insights and leadership.
`;
  }

  if (article.style === "storytelling") {
    styleInstructions = `
Use storytelling.
Start with a relatable situation.
Create curiosity.
`;
  }

  if (article.style === "viral") {
    styleInstructions = `
Use a strong hook.
Create curiosity.
Use short impactful sentences.
Make readers want to continue.
`;
  }

  if (article.style === "technical") {
    styleInstructions = `
Use technical analysis.
Focus on industry implications.
Use professional terminology.
`;
  }

  const prompt = `
You are a top LinkedIn content creator.

${styleInstructions}

Create a LinkedIn post:

- 15 short sentences
- Strong hook
- Clear formatting
- End with a question
- No hashtags

Article Title:
${article.title}

Article Content:
${article.content}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
