import { useState } from "react";
import type { ChangeEvent } from "react";
import type { PostStyle } from "../types/post";
import { createMarkdown } from "../utils/markdown";

function Popup() {
  // const [title, setTitile] = useState("");
  const [article, setArticle] = useState<any>(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<PostStyle>("professional");

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

    getArticle();

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
            style,
          });

          setPost(result);
          setLoading(false);
        },
      );
    });
  };

  const handleCopy = async () => {
    if (!post) return;

    await navigator.clipboard.writeText(post);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStyleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value as PostStyle);
  };

  const exportMarkdown = () => {
    // alert("export");

    console.log("Export");

    console.log("Post:", post);
    console.log("Style:", style);

    if (!post) {
      console.warn("Missing post content. Cannot export markdown.");
      return;
    }

    const markdown = createMarkdown(article, post, style);

    console.log("Generated markdown:", markdown);

    const blob = new Blob([markdown], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    const filename = article.title
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    a.download = `${filename}.md`;

    a.click();

    console.log("Exported markdown:", markdown);

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: 350, padding: 16 }}>
      <h2>AI Post Generator</h2>

      <button onClick={getArticle}>Get Article</button>
      <button onClick={handleGeneratePost}>Generate LinkedIn Post</button>
      <button onClick={handleCopy} disabled={!post}>
        Copy Post
      </button>

      <button
        onClick={() => {
          // console.log("Button Clicked");
          // alert("clicked");
          exportMarkdown();
        }}
      >
        Export as Markdown
      </button>

      <select value={style} onChange={handleStyleChange}>
        <option value="professional">Professional</option>

        <option value="storytelling">Storytelling</option>

        <option value="viral">Viral</option>

        <option value="technical">Technical</option>
      </select>

      <hr />

      <p>
        <strong>Result:</strong>
      </p>
      {copied && <p>✅ Copied to clipboard</p>}

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
