"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getProgress, getChapters } from "@/lib/api";

interface Chapter {
  id: string;
  title: string;
  order: number;
  tier_required: string;
  estimated_minutes: number;
}

interface ChapterProgress {
  chapter_id: string;
  completed: boolean;
  score: number | null;
}

interface ProgressData {
  chapters_completed: number;
  total_chapters: number;
  average_score: number;
  streak_days: number;
  last_active: string;
  chapter_progress: ChapterProgress[];
}

export default function DashboardPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const [chaptersData, progressData] = await Promise.all([
          getChapters(token ?? undefined),
          user?.id ? getProgress(user.id, token!) : null,
        ]);
        setChapters(chaptersData.chapters ?? []);
        if (progressData) setProgress(progressData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, getToken]);

  const completedIds = new Set(
    progress?.chapter_progress.filter((p) => p.completed).map((p) => p.chapter_id) ?? []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-brand-700">
            Course Companion FTE
          </Link>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/dashboard" className="font-semibold text-brand-600">
              Dashboard
            </Link>
            <Link href="/progress">Progress</Link>
            <Link href="/premium">Upgrade</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName ?? "Student"}!
          </h1>
          <p className="text-gray-500 mt-1">Continue your AI Agent Development journey.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Chapters Done",
              value: `${progress?.chapters_completed ?? 0} / ${progress?.total_chapters ?? 10}`,
            },
            { label: "Avg Score", value: `${progress?.average_score ?? 0}%` },
            { label: "Streak", value: `${progress?.streak_days ?? 0} days 🔥` },
            {
              label: "Last Active",
              value: progress?.last_active ?? "Today",
            },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl font-extrabold text-brand-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="card mb-10">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold">Overall Progress</span>
            <span>
              {progress?.chapters_completed ?? 0} / {progress?.total_chapters ?? 10} chapters
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-brand-500 h-3 rounded-full transition-all"
              style={{
                width: `${((progress?.chapters_completed ?? 0) / (progress?.total_chapters ?? 10)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Chapter list */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Chapters</h2>
        <div className="space-y-3">
          {chapters.map((ch) => {
            const done = completedIds.has(ch.id);
            const chProgress = progress?.chapter_progress.find((p) => p.chapter_id === ch.id);
            return (
              <div
                key={ch.id}
                className="card flex items-center justify-between hover:border-brand-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      done
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {done ? "✓" : ch.order}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{ch.title}</div>
                    <div className="text-xs text-gray-400">
                      {ch.estimated_minutes} min ·{" "}
                      <span
                        className={
                          ch.tier_required === "free"
                            ? "text-green-600"
                            : "text-brand-600"
                        }
                      >
                        {ch.tier_required}
                      </span>
                      {chProgress?.score != null && (
                        <span className="ml-2 text-gray-500">
                          Score: {chProgress.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/learn/${ch.id}`}
                  className="text-sm btn-primary py-1.5 px-4"
                >
                  {done ? "Review" : "Start"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
