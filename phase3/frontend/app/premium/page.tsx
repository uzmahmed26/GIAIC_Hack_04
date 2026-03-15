import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

const plans = [
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    color: "border-gray-300",
    badge: null,
    features: [
      "All 10 chapters unlocked",
      "All 5 quizzes",
      "Progress tracking + streaks",
      "ChatGPT App access",
      "Chapter navigation",
    ],
    notIncluded: ["Adaptive Learning Path", "LLM-Graded Assessment"],
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    color: "border-brand-500 ring-2 ring-brand-500",
    badge: "Best Value",
    features: [
      "Everything in Premium",
      "Adaptive Learning Path (AI-powered)",
      "LLM-Graded free-form assessments",
      "Personalized study recommendations",
      "Cost-efficient Claude Sonnet AI",
    ],
    notIncluded: ["Team analytics", "Multiple seats"],
  },
  {
    name: "Team",
    price: "$49.99",
    period: "/month",
    color: "border-gray-300",
    badge: null,
    features: [
      "Everything in Pro",
      "Up to 10 team seats",
      "Team learning analytics dashboard",
      "Bulk progress reports",
      "Priority email support",
    ],
    notIncluded: [],
  },
];

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-brand-700">
            Course Companion FTE
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-16 max-w-3xl mx-auto">
        <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          Unlock Your Full Potential
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Upgrade Your Learning Plan
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Free plan gives you Chapters 1–3. Upgrade to unlock the complete AI Agent Development
          curriculum — and AI-powered personalization.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`card flex flex-col border-2 ${plan.color}`}>
              {plan.badge && (
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
                  {plan.badge}
                </div>
              )}
              <div className="text-3xl font-extrabold text-gray-900">
                {plan.price}
                <span className="text-sm font-normal text-gray-500">{plan.period}</span>
              </div>
              <div className="text-lg font-semibold text-gray-800 mt-1 mb-1">{plan.name}</div>
              <hr className="my-4 border-gray-100" />

              <div className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-0.5">✗</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <SignUpButton mode="modal">
                <button
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                    plan.badge
                      ? "bg-brand-600 hover:bg-brand-700 text-white"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Get {plan.name}
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>

        {/* Comparison note */}
        <div className="mt-12 card bg-blue-50 border-blue-100 text-sm text-blue-700">
          <p className="font-semibold mb-1">Why upgrade to Pro?</p>
          <p>
            The <strong>Adaptive Learning Path</strong> uses Claude Sonnet AI to analyze your
            quiz scores, identify your weak areas, and generate a personalized chapter sequence
            tailored to your learning goal. The <strong>LLM-Graded Assessment</strong> goes
            beyond multiple choice — it reads your written explanations and scores them on
            conceptual accuracy, completeness, and practical understanding.
          </p>
        </div>
      </section>
    </main>
  );
}
