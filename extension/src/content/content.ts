import { Readability } from "@mozilla/readability";

function extractArticle() {
  const documentClone = document.cloneNode(true) as Document;

  const article = new Readability(documentClone).parse();

  return article;
}

chrome.runtime.onMessage.addListener(
  (
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => {
    if (message.type === "GET_ARTICLE") {
      const article = extractArticle();

      sendResponse({
        title: article?.title,
        content: article?.textContent,
        excerpt: article?.excerpt,
        author: article?.byline,
      });
    }

    return true;
  },
);
