const API_BASE_URL = "http://127.0.0.1:8000";

export type GeneratedPostHistoryItem = {
  id: string;
  article_title: string;
  article_url: string;
  article_author?: string | null;
  article_image?: string | null;
  article_excerpt?: string | null;
  generated_post: string;
  style: string;
  created_at: string;
};

export type GeneratedPostHistoryResponse = {
  success: boolean;
  posts: GeneratedPostHistoryItem[];
};

export async function getGeneratedPostHistory(
  token: string
): Promise<GeneratedPostHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/history/posts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to load post history");
  }

  return data.posts;
}