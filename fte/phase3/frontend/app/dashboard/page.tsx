"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getProgress, getChapters } from "@/lib/api";

interface Chapter {
  id: string;
  title: string;
  order_num: number;
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
        const chaptersData = await getChapters(token ?? undefined);
        setChapters(chaptersData.chapters ?? []);
        if (user?.id) {
          try {
            const progressData = await getProgress(user.id, token!);
            setProgress(progressData);
          } catch {
            // No progress yet
          }
        }
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-neon-cyan animate-pulse">Loading dashboard...</div>
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
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <Link href="/" className="font-bold neon-text">Course Companion FTE</Link>
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/dashboard" className="text-neon-cyan font-semibold">Dashboard</Link>
          <Link href="/progress" className="text-gray-400 hover:text-white transition-colors">Progress</Link>
          <Link href="/premium" className="text-gray-400 hover:text-white transition-colors">Upgrade</Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="neon-text">{user?.firstName ?? "Student"}</span>!
          </h1>
          <p className="text-gray-500 mt-1">Continue your AI Agent Development journey.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Chapters Done", value: `${progress?.chapters_completed ?? 0} / 10`, color: "text-neon-cyan" },
            { label: "Avg Score", value: `${progress?.average_score ?? 0}%`, color: "text-neon-green" },
            { label: "Streak", value: `${progress?.streak_days ?? 0} days 🔥`, color: "text-neon-pink" },
            { label: "Last Active", value: progress?.last_active ?? "Today", color: "text-neon-purple" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="card mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="font-semibold text-white">Overall Progress</span>
            <span className="text-neon-cyan font-bold">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-neon-cyan to-neon-purple h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {progress?.chapters_completed ?? 0} of 10 chapters completed
          </div>
        </div>

        {/* Quizzes */}
        <h2 className="text-lg font-bold text-white mb-4">Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { id: "quiz-001", title: "Quiz 1", chapter: "ch-001" },
            { id: "quiz-002", title: "Quiz 2", chapter: "ch-003" },
            { id: "quiz-003", title: "Quiz 3", chapter: "ch-005" },
          ].map((q) => (
            <Link
              key={q.id}
              href={`/quiz/${q.id}`}
              className="card flex items-center justify-between group hover:border-neon-purple/40 transition-all"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-neon-purple transition-colors">
                  {q.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{q.chapter}</div>
              </div>
              <span className="text-neon-purple text-sm">Start →</span>
            </Link>
          ))}
        </div>

        {/* Chapters */}
        <h2 className="text-lg font-bold text-white mb-4">
          Course Chapters{" "}
          <span className="text-xs text-gray-500 font-normal">({chapters.length} total)</span>
        </h2>

        {chapters.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-400">No chapters found. Make sure the backend is running.</p>
            <p className="text-gray-600 text-sm mt-1">Backend: http://localhost:8000</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((ch) => {
              const done = completedIds.has(ch.id);
              return (
                <div
                  key={ch.id}
                  className="card flex items-center justify-between group hover:border-neon-cyan/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border ${
                        done
                          ? "border-neon-green/50 text-neon-green bg-neon-green/10"
                          : "border-gray-700 text-gray-500"
                      }`}
                    >
                      {done ? "✓" : ch.order_num}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                        {ch.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{ch.estimated_minutes} min</span>
                        <span>·</span>
                        <span
                          className={
                            ch.tier_required === "free"
                              ? "text-neon-green"
                              : "text-neon-cyan"
                          }
                        >
                          {ch.tier_required}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/learn/${ch.id}`}
                    className="text-sm border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-gray-950 font-semibold px-4 py-1.5 rounded-lg transition-all duration-200"
                  >
                    {done ? "Review" : "Start →"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
