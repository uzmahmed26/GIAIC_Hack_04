/**
 * API client for Course Companion FTE backend.
 * All requests include the Clerk JWT token for auth.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch(path: string, token?: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw { status: res.status, detail: error.detail ?? error };
  }
  return res.json();
}

// ── Chapters ──────────────────────────────────────────────────────────────────

export const getChapters = (token?: string) =>
  apiFetch("/api/v1/chapters", token);

export const getChapter = (chapterId: string, token?: string) =>
  apiFetch(`/api/v1/chapters/${chapterId}`, token);

export const getNextChapter = (chapterId: string, token?: string) =>
  apiFetch(`/api/v1/chapters/${chapterId}/next`, token);

export const getPrevChapter = (chapterId: string, token?: string) =>
  apiFetch(`/api/v1/chapters/${chapterId}/previous`, token);

// ── Search ────────────────────────────────────────────────────────────────────

export const searchContent = (query: string, chapter?: string, limit = 3, token?: string) => {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  if (chapter) params.set("chapter", chapter);
  return apiFetch(`/api/v1/search?${params}`, token);
};

// ── Quizzes ───────────────────────────────────────────────────────────────────

export const getQuiz = (quizId: string, token: string) =>
  apiFetch(`/api/v1/quizzes/${quizId}`, token);

export const submitQuiz = (quizId: string, answers: Record<string, string>, token: string) =>
  apiFetch(`/api/v1/quizzes/${quizId}/submit`, token, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

// ── Progress ──────────────────────────────────────────────────────────────────

export const getProgress = (userId: string, token: string) =>
  apiFetch(`/api/v1/progress/${userId}`, token);

export const updateProgress = (
  userId: string,
  chapterId: string,
  completed: boolean,
  score: number | null,
  token: string
) =>
  apiFetch(`/api/v1/progress/${userId}/chapter/${chapterId}`, token, {
    method: "PUT",
    body: JSON.stringify({ completed, score }),
  });

export const getStreak = (userId: string, token: string) =>
  apiFetch(`/api/v1/progress/${userId}/streak`, token);

// ── Access ────────────────────────────────────────────────────────────────────

export const checkAccess = (userId: string, chapterId: string, token: string) =>
  apiFetch(`/api/v1/access/${userId}/chapter/${chapterId}`, token);
