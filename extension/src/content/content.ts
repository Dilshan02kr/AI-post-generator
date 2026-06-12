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
