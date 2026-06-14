import { generateLinkedInPost } from "../services/gemini";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GENERATE_POST") {
    (async () => {
      try {
        const article = message.article;

        const post = await generateLinkedInPost({
          title: article.title,
          content: article.content.slice(0, 3000),
        });

        sendResponse(post);
      } catch (err) {
        sendResponse("Error generating post," + (err as Error).message);
      }
    })();

    return true;
  }
});
