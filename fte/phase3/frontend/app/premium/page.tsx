import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

const plans = [
  {
    name: "Premium",
    price: "$9.99",
    period: "/mo",
    color: "border-neon-cyan/30 hover:border-neon-cyan/60",
    badge: null,
    btnClass: "border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-gray-950",
    features: [
      "All 10 chapters unlocked",
      "All 5 quizzes",
      "Progress tracking + streaks",
      "ChatGPT App access",
    ],
    notIncluded: ["Adaptive Learning Path", "LLM-Graded Assessment"],
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/mo",
    color: "border-neon-purple/60 shadow-neon-purple",
    badge: "Best Value",
    btnClass: "border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white",
    features: [
      "Everything in Premium",
      "Adaptive Learning Path (AI)",
      "LLM-Graded assessments",
      "Personalized study plan",
      "Claude Sonnet AI powered",
    ],
    notIncluded: ["Team analytics", "Multiple seats"],
  },
  {
    name: "Team",
    price: "$49.99",
    period: "/mo",
    color: "border-neon-pink/30 hover:border-neon-pink/60",
    badge: null,
    btnClass: "border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white",
    features: [
      "Everything in Pro",
      "Up to 10 team seats",
      "Team analytics dashboard",
      "Bulk progress reports",
      "Priority support",
    ],
    notIncluded: [],
  },
];

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <Link href="/" className="font-bold neon-text">Course Companion FTE</Link>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
          ← Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
        <div className="neon-badge mb-4">Unlock Your Full Potential</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Upgrade Your <span className="neon-text">Learning Plan</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Free plan gives you Chapters 1–3. Upgrade to unlock the complete AI Agent curriculum
          with AI-powered personalization.
        </p>
      </section>

      {/* Plans */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col bg-gray-900 border rounded-xl p-6 transition-all duration-300 ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-neon-purple text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="text-3xl font-extrabold text-white">
                {plan.price}
                <span className="text-sm font-normal text-gray-500">{plan.period}</span>
              </div>
              <div className="text-lg font-bold text-white mt-1 mb-4">{plan.name}</div>
              <hr className="border-gray-800 mb-4" />

              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-neon-green mt-0.5">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5">✗</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <SignUpButton mode="modal">
                <button className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${plan.btnClass}`}>
                  Get {plan.name}
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-10 card-glow text-sm text-gray-400">
          <p className="font-semibold text-neon-purple mb-1">Why upgrade to Pro?</p>
          <p>
            The <span className="text-white font-semibold">Adaptive Learning Path</span> uses Claude Sonnet AI
            to analyze your quiz scores and generate a personalized chapter sequence. The{" "}
            <span className="text-white font-semibold">LLM-Graded Assessment</span> reads your written
            explanations and scores them on conceptual accuracy and practical understanding.
          </p>
        </div>
      </section>
    </main>
  );
}
