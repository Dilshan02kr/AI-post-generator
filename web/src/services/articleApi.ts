const API_BASE_URL = "http://127.0.0.1:8000";

export type PostStyle = "professional" | "storytelling" | "viral" | "technical";

export type ExtractedArticle = {
  title: string;
  content: string;
  excerpt?: string | null;
  author?: string | null;
  image?: string | null;
  url: string;
};

export type GenerateFromUrlPayload = {
  url: string;
  style: PostStyle;
};

export type GenerateFromUrlResponse = {
  success: boolean;
  article: ExtractedArticle;
  post: string;
};

export async function generatePostFromUrl(
  payload: GenerateFromUrlPayload,
  token: string
): Promise<GenerateFromUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/articles/generate-from-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Failed to generate post from URL"
    );
  }

  return data;
}