import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Start your AI Agent journey",
    features: ["Chapters 1–3", "Basic quizzes", "Progress tracking", "ChatGPT App access"],
    cta: "Get Started Free",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    description: "Full course access",
    features: ["All 10 chapters", "All quizzes", "Progress tracking", "Streak rewards"],
    cta: "Go Premium",
    href: "/premium",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    description: "AI-powered learning",
    features: [
      "Everything in Premium",
      "Adaptive Learning Path (AI)",
      "LLM-graded assessments",
      "Personalized study plan",
    ],
    cta: "Go Pro",
    href: "/premium",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49.99",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Multiple seats",
      "Team analytics dashboard",
      "Priority support",
    ],
    cta: "Get Team",
    href: "/premium",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-xl font-bold text-brand-700">Course Companion FTE</span>
        <div className="flex gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-secondary text-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary text-sm">Get Started</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary text-sm">
              Dashboard
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          GIAIC Hackathon IV — Digital FTE
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Master AI Agent Development
          <br />
          <span className="text-brand-600">with Your 24/7 AI Tutor</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Learn Claude Agent SDK, MCP Protocol, Agent Skills, and Agent Factory Architecture —
          guided by a Digital Full-Time Equivalent tutor that never sleeps.
        </p>
        <div className="flex gap-4 justify-center">
          <SignUpButton mode="modal">
            <button className="btn-primary text-base px-8 py-3">
              Start Learning Free
            </button>
          </SignUpButton>
          <Link href="#pricing" className="btn-secondary text-base px-8 py-3">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Build AI Agents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "📚",
              title: "10 In-Depth Chapters",
              desc: "From SDK basics to Agent Factory architecture — a complete curriculum.",
            },
            {
              icon: "🧠",
              title: "AI-Powered Learning",
              desc: "Adaptive learning paths and LLM-graded assessments for Pro users.",
            },
            {
              icon: "🔥",
              title: "Streak & Progress Tracking",
              desc: "Daily streaks, milestone rewards, and chapter-by-chapter progress.",
            },
          ].map((f) => (
            <div key={f.title} className="card text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-gray-500 mb-12">Start free. Upgrade when you're ready.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card flex flex-col ${
                tier.highlight ? "border-brand-500 ring-2 ring-brand-500" : ""
              }`}
            >
              {tier.highlight && (
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
                  Most Popular
                </div>
              )}
              <div className="text-2xl font-extrabold text-gray-900">
                {tier.price}
                {tier.period && (
                  <span className="text-sm font-normal text-gray-500">{tier.period}</span>
                )}
              </div>
              <div className="font-semibold text-gray-800 mt-1">{tier.name}</div>
              <div className="text-sm text-gray-500 mt-1 mb-4">{tier.description}</div>
              <ul className="flex-1 space-y-2 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`text-center text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                  tier.highlight
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 py-8 border-t border-gray-100">
        Course Companion FTE — Built for GIAIC Hackathon IV
      </footer>
    </main>
  );
}
