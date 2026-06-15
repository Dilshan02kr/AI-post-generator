import { generateLinkedInPost } from "../services/gemini";
import type { PostStyle } from "../types/post";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GENERATE_POST") {
    (async () => {
      try {
        const article = message.article;
        const style: PostStyle = message.style;

        const post = await generateLinkedInPost({
          title: article.title,
          content: article.content.slice(0, 3000),
          style,
        });

        sendResponse(post);
      } catch (err) {
        sendResponse("Error generating post," + (err as Error).message);
      }
    })();

    return true;
  }
});
