"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getQuiz, submitQuiz } from "@/lib/api";

interface Question {
  id: string;
  text: string;
  type: "mcq" | "truefalse" | "fill";
  options: string[] | null;
}

interface Quiz {
  id: string;
  chapter_id: string;
  title: string;
  questions: Question[];
}

interface QuestionResult {
  question_id: string;
  correct: boolean;
  student_answer: string;
}

interface QuizResult {
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_count: number;
  results: QuestionResult[];
}

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { getToken } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const data = await getQuiz(quizId, token!);
        setQuiz(data);
      } catch (err) {
        console.error("Quiz load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId, getToken]);

  function selectAnswer(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const token = await getToken();
      const data = await submitQuiz(quizId, answers, token!);
      setResult(data);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading quiz...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Quiz not found.
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  // Results view
  if (result) {
    const pct = Math.round((result.correct_count / result.total_questions) * 100);
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="card max-w-lg w-full text-center">
          <div className="text-5xl mb-4">{pct >= 70 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {pct >= 70 ? "Great Work!" : "Keep Practicing!"}
          </h2>
          <div className="text-5xl font-extrabold text-brand-600 my-4">{pct}%</div>
          <p className="text-gray-500 mb-2">
            {result.correct_count} of {result.total_questions} correct
          </p>

          {/* Per-question breakdown */}
          <div className="text-left mt-6 space-y-3">
            {result.results.map((r, i) => (
              <div
                key={r.question_id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  r.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                <span className="font-bold">{r.correct ? "✓" : "✗"}</span>
                <span className="text-sm">
                  Q{i + 1}: You answered &quot;{r.student_answer}&quot;
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <Link href={`/learn/${quiz.chapter_id}`} className="btn-secondary flex-1 text-center">
              Review Chapter
            </Link>
            <Link href="/dashboard" className="btn-primary flex-1 text-center">
              Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
            ← Dashboard
          </Link>
          <div className="text-sm text-gray-500">
            Question {currentQ + 1} of {totalQ}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h1>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="card mb-6">
          <div className="text-sm text-gray-400 mb-3">
            Question {currentQ + 1} / {totalQ}
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-6">{question.text}</p>

          {/* MCQ / True-False options */}
          {question.options && (
            <div className="space-y-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(question.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors text-sm ${
                    answers[question.id] === opt
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 hover:border-brand-300 text-gray-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Fill in the blank */}
          {question.type === "fill" && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[question.id] ?? ""}
              onChange={(e) => selectAnswer(question.id, e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-brand-500 rounded-lg px-4 py-3 text-sm outline-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ((q) => q - 1)}
              className="btn-secondary flex-1"
            >
              Previous
            </button>
          )}
          {currentQ < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQ((q) => q + 1)}
              disabled={!answers[question.id]}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Grading..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
