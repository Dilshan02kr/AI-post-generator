import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { PostStyle } from "../types/post";
import { createMarkdown } from "../utils/markdown";
import {
  savePost,
  getPosts,
  deletePost,
  clearHistory,
} from "../storage/history";
import type { HistoryItem } from "../types/history";
import "./Popup.css";
import { generatePostFromBackend } from "../services/backendApi";

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
  const [showHistory, setShowHistory] = useState(false);
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

  // const generatePost = async (articleData: Article): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     chrome.runtime.sendMessage(
  //       {
  //         type: "GENERATE_POST",
  //         article: articleData,
  //         style,
  //       },
  //       (response: string) => {
  //         if (chrome.runtime.lastError) {
  //           reject(chrome.runtime.lastError.message);
  //           return;
  //         }

  //         resolve(response);
  //       },
  //     );
  //   });
  // };

  const handleGeneratePost = async () => {
    try {
      setLoading(true);
      setError("");
      setPost("");

      const articleData = article ?? (await fetchArticleFromCurrentTab());

      if (!articleData) {
        setError("Could not extract article from this page.");
        return;
      }

      const articleContent = articleData.content?.trim();

      console.log("Article Content ", articleContent);

      if (!articleContent) {
        setError("Article content is empty. Try another article page.");
        return;
      }

      setArticle(articleData);

      const result = await generatePostFromBackend({
        title: articleData.title || "Untitled Article",
        content: articleContent,
        style,
      });

      console.log("Fetch result ", result);

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

      if (err instanceof Error) {
        setError(`Error message is ${err.message}`);
      } else {
        setError("Something went wrong while generating the post.");
      }
    } finally {
      setLoading(false);
    }
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

  // const handleGeneratePost = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     setPost("");

  //     const articleData = await fetchArticleFromCurrentTab();

  //     if (!articleData) {
  //       setError("Could not extract article from this page.");
  //       return;
  //     }

  //     setArticle(articleData);

  //     const result = await generatePost(articleData);

  //     setPost(result);

  //     await savePost({
  //       id: crypto.randomUUID(),
  //       title: articleData.title || "Untitled Article",
  //       style,
  //       post: result,
  //       image: articleData.image,
  //       createdAt: new Date().toISOString(),
  //     });

  //     await loadHistory();
  //   } catch (err) {
  //     console.error(err);
  //     setError("Something went wrong while generating the post.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const handleOpen = (item: HistoryItem) => {
    setArticle({
      title: item.title,
      image: item.image,
    });

    setPost(item.post);
    setStyle(item.style);
    setCopied(false);
    setError("");
    setShowHistory(false);
  };

  const handleDelete = async (id: string) => {
    try {
      setError("");

      await deletePost(id);
      await loadHistory();
    } catch (err) {
      console.error(err);
      setError("Could not delete this history item.");
    }
  };

  const handleClearHistory = async () => {
    if (history.length === 0) return;

    const confirmed = confirm("Delete all saved history?");

    if (!confirmed) return;

    try {
      setError("");

      await clearHistory();
      setHistory([]);
    } catch (err) {
      console.error(err);
      setError("Could not clear history.");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const wordCount = post.trim() ? post.trim().split(/\s+/).length : 0;

  return (
    <main className="popup">
      <header className="app-header">
        <div>
          <h1>AI Post Generator</h1>
          <p>Create a professional LinkedIn post from the current article.</p>
        </div>
      </header>

      <section className="card controls-card">
        <div className="form-group">
          <label htmlFor="post-style">Post style</label>

          <select id="post-style" value={style} onChange={handleStyleChange}>
            <option value="professional">Professional</option>
            <option value="storytelling">Storytelling</option>
            <option value="viral">Viral</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="btn btn-outline"
            onClick={getArticle}
          >
            Get Article
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGeneratePost}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Post"}
          </button>
        </div>

        {error && <p className="message message-error">{error}</p>}
        {copied && (
          <p className="message message-success">Copied to clipboard.</p>
        )}
      </section>

      {article && (
        <section className="card article-card">
          <div className="section-title">
            <span>Source Article</span>
          </div>

          {article.image && (
            <img src={article.image} alt="Article" className="article-image" />
          )}

          <div className="article-details">
            <h2>{article.title || "Untitled Article"}</h2>

            {article.author && (
              <p className="article-author">By {article.author}</p>
            )}

            {article.excerpt && (
              <p className="article-excerpt">{article.excerpt}</p>
            )}
          </div>
        </section>
      )}

      <section className="card result-card">
        <div className="result-header">
          <div>
            <div className="section-title">
              <span>Result</span>
            </div>

            <h2>Generated LinkedIn Post</h2>
          </div>

          {post && <span className="word-count">{wordCount} words</span>}
        </div>

        {loading && (
          <div className="result-placeholder">
            <div className="spinner" />
            <p>Generating your post...</p>
          </div>
        )}

        {!loading && !post && (
          <div className="result-placeholder">
            <p>No post generated yet.</p>
          </div>
        )}

        {post && (
          <>
            <textarea value={post} readOnly rows={14} className="post-output" />

            <div className="result-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCopy}
                disabled={!post}
              >
                Copy Post
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={exportMarkdown}
                disabled={!post}
              >
                Export Markdown
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card history-card">
        <button
          type="button"
          className="history-toggle"
          onClick={() => setShowHistory((current) => !current)}
          aria-expanded={showHistory}
        >
          <span>History</span>

          <span className="history-meta">
            {history.length} saved {showHistory ? "▲" : "▼"}
          </span>
        </button>

        {showHistory && (
          <div className="history-content">
            <div className="history-toolbar">
              <p>Saved generated posts</p>

              <button
                type="button"
                className="clear-history-btn"
                onClick={handleClearHistory}
                disabled={history.length === 0}
              >
                Clear History
              </button>
            </div>

            <div className="history-list">
              {history.length === 0 && (
                <div className="empty-history">
                  <p>No saved posts yet.</p>
                </div>
              )}

              {history.map((item) => (
                <article key={item.id} className="history-item">
                  <div className="history-main">
                    <h3>{item.title}</h3>

                    <div className="history-info">
                      <span>{item.style}</span>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="history-actions">
                    <button
                      type="button"
                      className="history-action-btn open-btn"
                      onClick={() => handleOpen(item)}
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      className="history-action-btn delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Popup;
