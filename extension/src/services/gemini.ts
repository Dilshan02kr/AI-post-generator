import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateLinkedInPost(article: {
  title: string;
  content: string;
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert LinkedIn content creator.

Create a LinkedIn post with:

- Strong hook
- 15 short sentences
- Professional tone
- Easy readability
- Line breaks between thoughts
- End with a question
- No hashtags

Article title:
${article.title}

Article:
${article.content}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
