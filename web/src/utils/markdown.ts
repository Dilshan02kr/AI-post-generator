import type { ExtractedArticle } from "../services/articleApi";
import type { GeneratedPostHistoryItem } from "../services/historyApi";

type CreateMarkdownParams = {
  article?: ExtractedArticle | null;
  historyItem?: GeneratedPostHistoryItem | null;
  post: string;
};

export function createMarkdown({
  article,
  historyItem,
  post,
}: CreateMarkdownParams): string {
  const title =
    article?.title ||
    historyItem?.article_title ||
    "Generated LinkedIn Post";

  const sourceUrl =
    article?.url ||
    historyItem?.article_url ||
    "";

  const author =
    article?.author ||
    historyItem?.article_author ||
    "Unknown";

  const excerpt =
    article?.excerpt ||
    historyItem?.article_excerpt ||
    "";

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