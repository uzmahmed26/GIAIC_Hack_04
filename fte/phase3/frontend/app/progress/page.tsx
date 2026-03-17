"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getProgress, getStreak } from "@/lib/api";

interface ChapterProgress {
  chapter_id: string;
  completed: boolean;
  score: number | null;
  completed_at: string | null;
}

interface ProgressData {
  chapters_completed: number;
  total_chapters: number;
  average_score: number;
  streak_days: number;
  last_active: string;
  chapter_progress: ChapterProgress[];
}

interface StreakData {
  streak_days: number;
  last_active: string;
  milestone_reached: string | null;
}

export default function ProgressPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) { setLoading(false); return; }
      try {
        const token = await getToken();
        const [progressData, streakData] = await Promise.all([
          getProgress(user.id, token!),
          getStreak(user.id, token!),
        ]);
        setProgress(progressData);
        setStreak(streakData);
      } catch (err) {
        console.error("Progress load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-neon-cyan animate-pulse">Loading progress...</div>
      </div>
    );
  }

  const completionPct = progress
    ? Math.round((progress.chapters_completed / (progress.total_chapters || 10)) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800 backdrop-blur-sm">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
          ← Dashboard
        </Link>
        <span className="font-bold neon-text">Progress Tracker</span>
        <div />
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-white mb-8">
          Your <span className="neon-text">Learning Journey</span>
        </h1>

        {/* Streak card */}
        <div className="card mb-6 border border-neon-pink/30 bg-gradient-to-r from-gray-900 to-gray-900">
          <div className="flex items-center gap-6">
            <div className="text-6xl animate-pulse-slow">🔥</div>
            <div>
              <div className="text-4xl font-extrabold text-neon-pink">
                {streak?.streak_days ?? 0} days
              </div>
              <div className="text-gray-400 font-medium mt-1">Current Learning Streak</div>
              {streak?.milestone_reached && (
                <div className="mt-2 neon-badge border-neon-pink/50 text-neon-pink bg-neon-pink/10">
                  🏆 {streak.milestone_reached}
                </div>
              )}
              <div className="text-xs text-gray-600 mt-1">
                Last active: {streak?.last_active ?? "Today"}
              </div>
            </div>
          </div>
        </div>

        {/* Completion bar */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-white">Course Completion</span>
            <span className="text-2xl font-extrabold neon-text">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-neon-cyan to-neon-purple h-4 rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {progress?.chapters_completed ?? 0} of {progress?.total_chapters ?? 10} chapters completed
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-neon-green">
              {progress?.average_score ?? 0}%
            </div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Avg Quiz Score</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-neon-cyan">
              {progress?.chapters_completed ?? 0}
            </div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Chapters Done</div>
          </div>
        </div>

        {/* Chapter breakdown */}
        <h2 className="text-lg font-bold text-white mb-4">Chapter Details</h2>
        {(progress?.chapter_progress ?? []).length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            No progress yet. <Link href="/dashboard" className="text-neon-cyan hover:underline">Start learning →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(progress?.chapter_progress ?? []).map((cp) => (
              <div key={cp.chapter_id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                      cp.completed
                        ? "border-neon-green/50 text-neon-green bg-neon-green/10"
                        : "border-gray-700 text-gray-500"
                    }`}
                  >
                    {cp.completed ? "✓" : "–"}
                  </div>
                  <div>
                    <div className="font-medium text-white capitalize">
                      {cp.chapter_id.replace("-", " ").toUpperCase()}
                    </div>
                    {cp.completed_at && (
                      <div className="text-xs text-gray-500">
                        Completed {new Date(cp.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {cp.score != null ? (
                  <div className={`text-sm font-bold px-3 py-1 rounded-full border ${
                    cp.score >= 70
                      ? "border-neon-green/40 text-neon-green bg-neon-green/10"
                      : "border-neon-pink/40 text-neon-pink bg-neon-pink/10"
                  }`}>
                    {cp.score}%
                  </div>
                ) : (
                  <Link href={`/learn/${cp.chapter_id}`} className="text-xs text-neon-cyan hover:underline">
                    Start →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
