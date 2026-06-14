import { Readability } from "@mozilla/readability";

function extractArticleImage(): string | null {
  const ogImage = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content");

  if (ogImage) return ogImage;

  const twitterImage = document
    .querySelector('meta[name="twitter:image"]')
    ?.getAttribute("content");

  if (twitterImage) return twitterImage;

  // fallback to first image in article
  const firstImage = document.querySelector("article img") as HTMLImageElement;

  if (firstImage?.src) {
    return firstImage.src;
  }

  return null;
}

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
        image: extractArticleImage(),
      });
    }

    return true;
  },
);
