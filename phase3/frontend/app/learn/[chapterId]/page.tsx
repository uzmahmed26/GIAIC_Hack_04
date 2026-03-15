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
  order: number;
  tier_required: string;
  estimated_minutes: number;
}

export default function ChapterReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { user } = useUser();
  const { getToken } = useAuth();

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

        // Check access first
        if (user?.id) {
          const access = await checkAccess(user.id, chapterId, token!);
          if (!access.allowed) {
            setAccessDenied(true);
            setUpgradeUrl(access.upgrade_url ?? "/premium");
            setLoading(false);
            return;
          }
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
  }, [chapterId, user, getToken]);

  async function markComplete() {
    try {
      const token = await getToken();
      if (user?.id) {
        await updateProgress(user.id, chapterId, true, null, token!);
        setCompleted(true);
      }
    } catch (err) {
      console.error("Progress update error:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading chapter...
      </div>
    );
  }

  if (accessDenied) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Chapter</h2>
          <p className="text-gray-500 mb-6">
            This chapter requires a Premium or higher subscription.
          </p>
          <Link href={upgradeUrl || "/premium"} className="btn-primary">
            Upgrade to Unlock
          </Link>
          <Link href="/dashboard" className="block mt-3 text-sm text-gray-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chapter not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
            ← Dashboard
          </Link>
          <div className="text-sm text-gray-400">
            Chapter {chapter.order} · {chapter.estimated_minutes} min
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="text-sm text-brand-600 font-semibold mb-2">
            Chapter {chapter.order}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{chapter.title}</h1>
        </div>

        {/* Content */}
        <article className="prose prose-gray max-w-none mb-12">
          <pre className="whitespace-pre-wrap font-sans text-base text-gray-800 leading-relaxed">
            {chapter.content}
          </pre>
        </article>

        {/* Complete button */}
        {!completed ? (
          <button
            onClick={markComplete}
            className="btn-primary w-full py-3 text-base"
          >
            Mark Chapter as Complete ✓
          </button>
        ) : (
          <div className="text-center text-green-600 font-semibold py-3 bg-green-50 rounded-lg">
            Chapter completed! 🎉
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {prevCh ? (
            <Link href={`/learn/${prevCh.id}`} className="btn-secondary text-sm">
              ← {prevCh.title}
            </Link>
          ) : (
            <div />
          )}
          {nextCh ? (
            <Link href={`/learn/${nextCh.id}`} className="btn-primary text-sm">
              {nextCh.title} →
            </Link>
          ) : (
            <Link href="/dashboard" className="btn-primary text-sm">
              Back to Dashboard →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
