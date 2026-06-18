import type { HistoryItem } from "../types/history";

const STORAGE_KEY = "history";

export async function savePost(item: HistoryItem) {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  const history = result[STORAGE_KEY] || [];

  history.unshift(item);

  await chrome.storage.local.set({
    [STORAGE_KEY]: history,
  });
}

export async function getPosts() {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return result[STORAGE_KEY] || [];
}

export async function deletePost(id: string) {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  const history = result[STORAGE_KEY] || [];

  const filtered = history.filter((item: HistoryItem) => item.id !== id);

  await chrome.storage.local.set({
    [STORAGE_KEY]: filtered,
  });
}

export async function clearHistory() {
  await chrome.storage.local.remove(STORAGE_KEY);
}
