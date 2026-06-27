import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import {
  generatePostFromUrl,
  type ExtractedArticle,
  type PostStyle,
} from "../services/articleApi";

import { createMarkdown } from "../utils/markdown";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [url, setUrl] = useState("");
  const [style, setStyle] = useState<PostStyle>("professional");

  const [article, setArticle] = useState<ExtractedArticle | null>(null);
  const [generatedPost, setGeneratedPost] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleDownloadMarkdown() {
    if (!generatedPost) {
      return;
    }

    const markdown = createMarkdown({
      article,
      post: generatedPost,
    });

    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "linkedin-post.md";
    link.click();

    URL.revokeObjectURL(url);
  }

  async function handleGenerateFromUrl(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setCopyMessage("");
    setArticle(null);
    setGeneratedPost("");

    if (!token) {
      setError("You must be logged in to generate a post.");
      return;
    }

    if (!url.trim()) {
      setError("Please enter an article URL.");
      return;
    }

    try {
      setIsGenerating(true);

      const response = await generatePostFromUrl(
        {
          url: url.trim(),
          style,
        },
        token,
      );

      setArticle(response.article);
      setGeneratedPost(response.post);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while generating the post.");
      }
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopyPost() {
    if (!generatedPost) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopyMessage("Post copied to clipboard.");

      setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    } catch {
      setCopyMessage("Could not copy post.");
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.full_name}.</p>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </section>

      <section className="dashboard-card">
        <h2>Generate LinkedIn Post from URL</h2>
        <p className="dashboard-muted-text">
          Paste an article URL, choose a writing style, and generate a LinkedIn
          post using AI.
        </p>

        <form onSubmit={handleGenerateFromUrl} className="url-generate-form">
          <label>
            Article URL
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/article"
              required
            />
          </label>

          <label>
            Post style
            <select
              value={style}
              onChange={(event) => setStyle(event.target.value as PostStyle)}
            >
              <option value="professional">Professional</option>
              <option value="storytelling">Storytelling</option>
              <option value="viral">Viral</option>
              <option value="technical">Technical</option>
            </select>
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Post"}
          </button>
        </form>
      </section>

      {article && (
        <section className="dashboard-card article-preview-card">
          <h2>Extracted Article</h2>

          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="article-preview-image"
            />
          )}

          <h3>{article.title}</h3>

          {article.author && (
            <p className="dashboard-muted-text">Author: {article.author}</p>
          )}

          {article.excerpt && (
            <p className="article-excerpt">{article.excerpt}</p>
          )}

          <a href={article.url} target="_blank" rel="noreferrer">
            Open original article
          </a>
        </section>
      )}

      {generatedPost && (
        <section className="dashboard-card generated-post-card">
          <div className="generated-post-header">
            <h2>Generated LinkedIn Post</h2>

            <div className="generated-post-actions">
              <button onClick={handleCopyPost} className="copy-button">
                Copy
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="download-button"
              >
                Download Markdown
              </button>
            </div>
          </div>

          {copyMessage && <p className="success-message">{copyMessage}</p>}

          <textarea
            value={generatedPost}
            onChange={(event) => setGeneratedPost(event.target.value)}
            className="generated-post-textarea"
          />
        </section>
      )}

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Your Account</h3>
          <p>
            <strong>Name:</strong> {user?.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Auth Provider:</strong> {user?.auth_provider}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Chrome Extension</h3>
          <p>Download and connect your extension here later.</p>
        </div>

        <div className="dashboard-card">
          <h3>Usage</h3>
          <p>Monthly AI generation usage will appear here later.</p>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
