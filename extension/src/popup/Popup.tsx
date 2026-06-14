import { useState } from "react";

function Popup() {
  // const [title, setTitile] = useState("");
  const [article, setArticle] = useState<any>(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);

  const getArticle = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      { type: "GET_ARTICLE" },
      (response: {
        title?: string;
        content?: string;
        excerpt?: string;
        author?: string;
      }) => {
        if (response) {
          setArticle(response);
        }
      },
    );
  };

  const handleGeneratePost = async () => {
    setLoading(true);

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { type: "GET_ARTICLE" },
        async (article) => {
          if (!article) {
            setLoading(false);
            return;
          }

          const result = await chrome.runtime.sendMessage({
            type: "GENERATE_POST",
            article,
          });

          setPost(result);
          setLoading(false);
        },
      );
    });
  };

  return (
    <div style={{ width: 350, padding: 16 }}>
      <h2>AI Post Generator</h2>

      <button onClick={getArticle}>Get Article</button>
      <button onClick={handleGeneratePost}>Generate LinkedIn Post</button>

      <hr />

      <p>
        <strong>Result:</strong>
      </p>

      {/* <p>{title}</p> */}

      {article && (
        <>
          <h3>{article.title}</h3>

          <p>
            <strong>Author:</strong>
            {article.author}
          </p>

          <p>{article.excerpt}</p>

          <textarea
            value={article.content}
            readOnly
            rows={10}
            style={{ width: "100%" }}
          />
        </>
      )}
      {article?.image && (
        <img
          src={article.image}
          alt="Article"
          style={{
            width: "100%",
            borderRadius: "8px",
          }}
        />
      )}
      {loading && <p>Generating post...</p>}

      {post && (
        <textarea value={post} readOnly rows={15} style={{ width: "100%" }} />
      )}
    </div>
  );
}

export default Popup;
