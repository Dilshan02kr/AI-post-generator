import type { PostStyle } from "../types/post";

export interface GeneratePostRequest {
  title: string;
  content: string;
  style: PostStyle;
}

interface BackendErrorResponse {
  success?: false;
  error?: {
    type?: string;
    message?: string;
    details?: unknown;
  };
  detail?: string;
}

interface GeneratePostResponse {
  success: boolean;
  post: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

function getErrorMessage(
  data: BackendErrorResponse | null,
  status: number,
): string {
  if (data?.error?.message) {
    return data.error.message;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (status === 429) {
    return "Gemini quote exceeded. Please wait and try again";
  }

  if (status === 500) {
    return "Backend server error. Please check the FastAPI terminal.";
  }

  return "Failed to generate post.";
}

export async function generatePostFromBackend(
  payload: GeneratePostRequest,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.status));
  }

  const result = data as GeneratePostResponse;

  if (!result.post) {
    throw new Error("Backend response did not include a generated post");
  }

  return result.post;
}
