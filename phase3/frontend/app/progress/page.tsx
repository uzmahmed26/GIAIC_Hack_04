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
      if (!user?.id) return;
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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading progress...
      </div>
    );
  }

  const completionPct = progress
    ? Math.round((progress.chapters_completed / progress.total_chapters) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
            ← Dashboard
          </Link>
          <span className="font-semibold text-gray-800">Progress Tracker</span>
          <div />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Learning Journey</h1>

        {/* Streak card */}
        <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 mb-8">
          <div className="flex items-center gap-6">
            <div className="text-6xl">🔥</div>
            <div>
              <div className="text-4xl font-extrabold text-orange-600">
                {streak?.streak_days ?? 0} days
              </div>
              <div className="text-gray-600 font-medium mt-1">Current Learning Streak</div>
              {streak?.milestone_reached && (
                <div className="mt-2 inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
                  🏆 {streak.milestone_reached}
                </div>
              )}
              <div className="text-sm text-gray-400 mt-1">
                Last active: {streak?.last_active ?? "Today"}
              </div>
            </div>
          </div>
        </div>

        {/* Course completion */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-800">Course Completion</span>
            <span className="text-2xl font-extrabold text-brand-600">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="bg-brand-500 h-4 rounded-full transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {progress?.chapters_completed ?? 0} of {progress?.total_chapters ?? 10} chapters
            completed
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-green-600">
              {progress?.average_score ?? 0}%
            </div>
            <div className="text-sm text-gray-500 mt-1">Average Quiz Score</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-brand-600">
              {progress?.chapters_completed ?? 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">Chapters Completed</div>
          </div>
        </div>

        {/* Chapter-by-chapter breakdown */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Chapter Details</h2>
        <div className="space-y-3">
          {(progress?.chapter_progress ?? []).map((cp) => (
            <div key={cp.chapter_id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    cp.completed
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {cp.completed ? "✓" : "–"}
                </div>
                <div>
                  <div className="font-medium text-gray-800 capitalize">
                    {cp.chapter_id.replace("-", " ").toUpperCase()}
                  </div>
                  {cp.completed_at && (
                    <div className="text-xs text-gray-400">
                      Completed {new Date(cp.completed_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              {cp.score != null ? (
                <div
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    cp.score >= 70
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {cp.score}%
                </div>
              ) : (
                <Link
                  href={`/learn/${cp.chapter_id}`}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Start →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
