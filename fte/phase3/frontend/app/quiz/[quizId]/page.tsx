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
  correct_answer: string | null;
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-neon-cyan animate-pulse">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">
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
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
        <div className="relative z-10 card-glow max-w-lg w-full text-center p-8">
          <div className="text-6xl mb-4">{pct >= 70 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            {pct >= 70 ? "Great Work!" : "Keep Practicing!"}
          </h2>
          <div className={`text-6xl font-extrabold my-4 ${pct >= 70 ? "text-neon-green" : "text-neon-pink"}`}>
            {pct}%
          </div>
          <p className="text-gray-400 mb-6">
            {result.correct_count} of {result.total_questions} correct
          </p>

          <div className="text-left space-y-3 mb-8">
            {result.results.map((r, i) => (
              <div
                key={r.question_id}
                className={`p-4 rounded-lg border ${
                  r.correct
                    ? "border-neon-green/30 bg-neon-green/5"
                    : "border-neon-pink/30 bg-neon-pink/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold text-lg ${r.correct ? "text-neon-green" : "text-neon-pink"}`}>
                    {r.correct ? "✓" : "✗"}
                  </span>
                  <span className="text-sm text-gray-400">Q{i + 1}</span>
                </div>
                <div className="text-sm text-gray-300">
                  Your answer: <span className={`font-semibold ${r.correct ? "text-neon-green" : "text-neon-pink"}`}>
                    &quot;{r.student_answer || "No answer"}&quot;
                  </span>
                </div>
                {!r.correct && r.correct_answer && (
                  <div className="text-sm text-gray-300 mt-1">
                    Correct answer: <span className="font-semibold text-neon-green">&quot;{r.correct_answer}&quot;</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link href={`/learn/${quiz.chapter_id}`} className="btn-secondary flex-1 text-center py-2.5">
              Review Chapter
            </Link>
            <Link href="/dashboard" className="btn-primary flex-1 text-center py-2.5">
              Dashboard →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm px-6 py-4 sticky top-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
            ← Dashboard
          </Link>
          <div className="text-xs text-gray-500">
            Question <span className="text-neon-cyan font-bold">{currentQ + 1}</span> of {totalQ}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-white mb-2">{quiz.title}</h1>
        <p className="text-gray-500 text-sm mb-6">Answer all questions to submit</p>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="card mb-6">
          <div className="neon-badge mb-4">Question {currentQ + 1} / {totalQ}</div>
          <p className="text-lg font-semibold text-white mb-6">{question.text}</p>

          {/* MCQ / True-False */}
          {question.options && (
            <div className="space-y-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(question.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    answers[question.id] === opt
                      ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                      : "border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Fill in blank */}
          {question.type === "fill" && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[question.id] ?? ""}
              onChange={(e) => selectAnswer(question.id, e.target.value)}
              className="w-full bg-gray-800 border-2 border-gray-700 focus:border-neon-cyan rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQ > 0 && (
            <button onClick={() => setCurrentQ((q) => q - 1)} className="btn-secondary flex-1">
              ← Previous
            </button>
          )}
          {currentQ < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQ((q) => q + 1)}
              disabled={!answers[question.id]}
              className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm border border-neon-green text-neon-green hover:bg-neon-green hover:text-gray-950 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? "Grading..." : "Submit Quiz ✓"}
            </button>
          )}
        </div>

        {/* Answered count */}
        <div className="text-center text-xs text-gray-600 mt-4">
          {Object.keys(answers).length} of {totalQ} answered
        </div>
      </div>
    </main>
  );
}
