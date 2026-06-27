import type { ExtractedArticle } from "../services/articleApi";

type CreateMarkdownParams = {
  article: ExtractedArticle | null;
  post: string;
};

export function createMarkdown({ article, post }: CreateMarkdownParams): string {
  const title = article?.title || "Generated LinkedIn Post";
  const sourceUrl = article?.url || "";
  const author = article?.author || "Unknown";
  const excerpt = article?.excerpt || "";

  return `# ${title}

## Generated LinkedIn Post

${post}

---

## Source Article

**Title:** ${title}

**Author:** ${author}

${excerpt ? `**Excerpt:** ${excerpt}\n` : ""}

${sourceUrl ? `**URL:** ${sourceUrl}` : ""}

---

Generated using AI Post Generator.
`;
}