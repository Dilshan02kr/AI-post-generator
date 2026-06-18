import type { PostStyle } from "./post";

export interface HistoryItem {
  id: string;

  title: string;

  style: PostStyle;

  post: string;

  image?: string;

  createdAt: string;
}
