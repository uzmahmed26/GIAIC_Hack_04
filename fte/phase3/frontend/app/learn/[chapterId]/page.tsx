"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getChapter, getNextChapter, getPrevChapter, checkAccess, updateProgress } from "@/lib/api";

interface Chapter {
  id: string;
  title: string;
  content: string;
  order_num: number;
  tier_required: string;
  estimated_minutes: number;
}

export default function ChapterReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { userId, getToken } = useAuth();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [nextCh, setNextCh] = useState<{ id: string; title: string } | null>(null);
  const [prevCh, setPrevCh] = useState<{ id: string; title: string } | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [upgradeUrl, setUpgradeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();

        try {
          const uid = userId ?? "guest";
          const access = await checkAccess(uid, chapterId, token!);
          if (!access.allowed) {
            setAccessDenied(true);
            setUpgradeUrl(access.upgrade_url ?? "/premium");
            setLoading(false);
            return;
          }
        } catch {
          // If access check fails, allow access
        }

        const [chapterData, nextData, prevData] = await Promise.all([
          getChapter(chapterId, token ?? undefined),
          getNextChapter(chapterId, token ?? undefined),
          getPrevChapter(chapterId, token ?? undefined),
        ]);

        setChapter(chapterData);
        setNextCh(nextData.chapter);
        setPrevCh(prevData.chapter);
      } catch (err) {
        console.error("Chapter load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId, getToken]);

  async function markComplete() {
    try {
      const token = await getToken();
      const uid = userId ?? "guest";
      if (uid !== "guest") {
        await updateProgress(uid, chapterId, true, null, token!);
      }
      setCompleted(true);
    } catch (err) {
      console.error("Progress update error:", err);
      setCompleted(true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-neon-cyan animate-pulse">Loading chapter...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
        <div className="relative z-10 card-glow max-w-md text-center p-10">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">Premium Chapter</h2>
          <p className="text-gray-400 mb-6">
            This chapter requires a Premium or higher subscription.
          </p>
          <Link href={upgradeUrl || "/premium"} className="btn-primary block mb-3">
            Upgrade to Unlock
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">
        Chapter not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm px-6 py-4 sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
            ← Dashboard
          </Link>
          <div className="text-xs text-gray-600">
            Chapter {chapter.order_num} · {chapter.estimated_minutes} min ·{" "}
            <span className={chapter.tier_required === "free" ? "text-neon-green" : "text-neon-cyan"}>
              {chapter.tier_required}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="neon-badge mb-3">Chapter {chapter.order_num}</div>
          <h1 className="text-4xl font-extrabold text-white">{chapter.title}</h1>
        </div>

        {/* Content */}
        <div className="card mb-8">
          <article className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
            {chapter.content}
          </article>
        </div>

        {/* Complete button */}
        {!completed ? (
          <button
            onClick={markComplete}
            className="w-full py-3 text-base border border-neon-green text-neon-green hover:bg-neon-green hover:text-gray-950 font-semibold rounded-lg transition-all duration-300 mb-6"
          >
            Mark Chapter as Complete ✓
          </button>
        ) : (
          <div className="text-center text-neon-green font-semibold py-3 bg-neon-green/10 border border-neon-green/30 rounded-lg mb-6">
            Chapter completed! 🎉
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          {prevCh ? (
            <Link href={`/learn/${prevCh.id}`} className="btn-secondary text-sm flex-1 text-center">
              ← {prevCh.title}
            </Link>
          ) : <div />}
          {nextCh ? (
            <Link href={`/learn/${nextCh.id}`} className="btn-primary text-sm flex-1 text-center">
              {nextCh.title} →
            </Link>
          ) : (
            <Link href="/dashboard" className="btn-primary text-sm flex-1 text-center">
              Back to Dashboard →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
