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
    if (message.type === "GET_PAGE_TITLE") {
      sendResponse({
        title: document.title,
      });
    }

    return true;
  },
);

console.log(extractArticle());
