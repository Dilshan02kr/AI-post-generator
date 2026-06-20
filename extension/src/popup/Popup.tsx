import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { PostStyle } from "../types/post";
import { createMarkdown } from "../utils/markdown";
import { savePost, getPosts } from "../storage/history";
import type { HistoryItem } from "../types/history";
import "./Popup.css";

type Article = {
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  image?: string;
};

function Popup() {
  const [article, setArticle] = useState<Article | null>(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<PostStyle>("professional");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  const fetchArticleFromCurrentTab = async (): Promise<Article | null> => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) return null;

    return new Promise((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { type: "GET_ARTICLE" },
        (response: Article | undefined) => {
          if (chrome.runtime.lastError || !response) {
            resolve(null);
            return;
          }

          resolve(response);
        },
      );
    });
  };

  const generatePost = async (articleData: Article): Promise<string> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "GENERATE_POST",
          article: articleData,
          style,
        },
        (response: string) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
            return;
          }

          resolve(response);
        },
      );
    });
  };

  const getArticle = async () => {
    setError("");

    const articleData = await fetchArticleFromCurrentTab();

    if (!articleData) {
      setError("Could not extract article from this page.");
      return;
    }

    setArticle(articleData);
  };

  const handleGeneratePost = async () => {
    try {
      setLoading(true);
      setError("");
      setPost("");

      const articleData = await fetchArticleFromCurrentTab();

      if (!articleData) {
        setError("Could not extract article from this page.");
        return;
      }

      setArticle(articleData);

      const result = await generatePost(articleData);

      setPost(result);

      await savePost({
        id: crypto.randomUUID(),
        title: articleData.title || "Untitled Article",
        style,
        post: result,
        image: articleData.image,
        createdAt: new Date().toISOString(),
      });

      await loadHistory();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the post.");
    } finally {
      setLoading(false);
    }
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
    if (!post || !article) {
      setError("Generate a post before exporting markdown.");
      return;
    }

    const markdown = createMarkdown(article, post, style);

    const blob = new Blob([markdown], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const safeTitle = article.title || "linkedin-post";

    const filename = safeTitle
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    a.href = url;
    a.download = `${filename || "linkedin-post"}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const loadHistory = async () => {
    const posts = await getPosts();
    setHistory(posts);
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setPost(item.post);
    setStyle(item.style);
    setCopied(false);
    setError("");
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <main className="popup">
      <section className="hero">
        <div>
          <p className="eyebrow">Chrome Extension</p>
          <h1>AI Post Generator</h1>
          <p className="subtitle">
            Turn any article into a polished LinkedIn post.
          </p>
        </div>

        <div className="badge">AI</div>
      </section>

      <section className="panel">
        <label className="field">
          <span>Post style</span>

          <select value={style} onChange={handleStyleChange}>
            <option value="professional">Professional</option>
            <option value="storytelling">Storytelling</option>
            <option value="viral">Viral</option>
            <option value="technical">Technical</option>
          </select>
        </label>

        <div className="actions-grid">
          <button type="button" className="btn secondary" onClick={getArticle}>
            Get Article
          </button>

          <button
            type="button"
            className="btn primary"
            onClick={handleGeneratePost}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Post"}
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={handleCopy}
            disabled={!post}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={exportMarkdown}
            disabled={!post}
          >
            Export MD
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}
        {copied && <div className="alert success">Copied to clipboard</div>}
      </section>

      {article && (
        <section className="article-card">
          {article.image && (
            <img src={article.image} alt="Article" className="article-image" />
          )}

          <div className="article-content">
            <p className="section-label">Current Article</p>
            <h2>{article.title || "Untitled Article"}</h2>

            {article.author && (
              <p className="author">
                By <span>{article.author}</span>
              </p>
            )}

            {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
          </div>
        </section>
      )}

      <section className="result-panel">
        <div className="section-header">
          <div>
            <p className="section-label">Generated Output</p>
            <h2>LinkedIn Post</h2>
          </div>

          {post && <span className="word-count">{post.split(/\s+/).length} words</span>}
        </div>

        {loading && (
          <div className="loading-box">
            <span className="loader" />
            <p>Creating your post...</p>
          </div>
        )}

        {!loading && !post && (
          <div className="empty-state">
            <p>Your generated post will appear here.</p>
          </div>
        )}

        {post && (
          <textarea
            value={post}
            readOnly
            rows={12}
            className="post-output"
          />
        )}
      </section>

      <section className="history-panel">
        <div className="section-header">
          <div>
            <p className="section-label">Saved Posts</p>
            <h2>History</h2>
          </div>

          <span className="history-count">{history.length}</span>
        </div>

        {history.length === 0 && (
          <div className="empty-state small">
            <p>No saved posts yet.</p>
          </div>
        )}

        <div className="history-list">
          {history.map((item) => (
            <article key={item.id} className="history-item">
              <div>
                <h3>{item.title}</h3>

                <div className="history-meta">
                  <span>{item.style}</span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                className="restore-btn"
                onClick={() => restoreHistoryItem(item)}
              >
                Restore
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Popup;