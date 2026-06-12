import { useState } from "react";

function Popup() {
  const [title, setTitile] = useState("");

  const getPageTitle = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      { type: "GET_PAGE_TITLE" },
      (response: { title?: string }) => {
        if (response?.title) {
          setTitile(response.title);
        }
      },
    );
  };

  return (
    <div style={{ width: 350, padding: 16 }}>
      <h2>AI Post Generator</h2>

      <button onClick={getPageTitle}>Get Page Title</button>

      <hr />

      <p>
        <strong>Result:</strong>
      </p>

      <p>{title}</p>
    </div>
  );
}

export default Popup;
