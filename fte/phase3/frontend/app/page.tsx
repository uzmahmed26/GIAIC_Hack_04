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
    color: "border-gray-700 hover:border-neon-green/50",
    btnClass: "border border-neon-green text-neon-green hover:bg-neon-green hover:text-gray-950",
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/mo",
    description: "Full course access",
    features: ["All 10 chapters", "All quizzes", "Progress tracking", "Streak rewards"],
    cta: "Go Premium",
    href: "/premium",
    highlight: false,
    color: "border-gray-700 hover:border-neon-cyan/50",
    btnClass: "border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-gray-950",
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/mo",
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
    color: "border-neon-purple/60 shadow-neon-purple",
    btnClass: "border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white",
  },
  {
    name: "Team",
    price: "$49.99",
    period: "/mo",
    description: "For teams and orgs",
    features: [
      "Everything in Pro",
      "Multiple seats",
      "Team analytics dashboard",
      "Priority support",
    ],
    cta: "Get Team",
    href: "/premium",
    highlight: false,
    color: "border-gray-700 hover:border-neon-pink/50",
    btnClass: "border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white",
  },
];

const features = [
  {
    icon: "📚",
    title: "10 In-Depth Chapters",
    desc: "From SDK basics to Agent Factory architecture — a complete curriculum.",
    color: "text-neon-cyan",
    border: "hover:border-neon-cyan/40",
  },
  {
    icon: "🧠",
    title: "AI-Powered Learning",
    desc: "Adaptive learning paths and LLM-graded assessments for Pro users.",
    color: "text-neon-purple",
    border: "hover:border-neon-purple/40",
  },
  {
    icon: "🔥",
    title: "Streak Tracking",
    desc: "Daily streaks, milestone rewards, and chapter-by-chapter progress.",
    color: "text-neon-pink",
    border: "hover:border-neon-pink/40",
  },
  {
    icon: "🤖",
    title: "ChatGPT App Skills",
    desc: "4 specialized AI skills: tutor, quiz master, concept explainer, motivator.",
    color: "text-neon-green",
    border: "hover:border-neon-green/40",
  },
  {
    icon: "⚡",
    title: "MCP Protocol",
    desc: "Learn Model Context Protocol — the future of AI tool integrations.",
    color: "text-yellow-400",
    border: "hover:border-yellow-400/40",
  },
  {
    icon: "🏭",
    title: "Agent Factory",
    desc: "Build production-ready multi-agent systems from scratch.",
    color: "text-neon-cyan",
    border: "hover:border-neon-cyan/40",
  },
];

const curriculum = [
  { num: "01", id: "ch-001", title: "Introduction to AI Agents", tier: "Free", color: "text-neon-green" },
  { num: "02", id: "ch-002", title: "Claude Agent SDK Basics", tier: "Free", color: "text-neon-green" },
  { num: "03", id: "ch-003", title: "MCP Protocol Deep Dive", tier: "Free", color: "text-neon-green" },
  { num: "04", id: "ch-004", title: "Agent Skills Design", tier: "Premium", color: "text-neon-cyan" },
  { num: "05", id: "ch-005", title: "Tool Use & Function Calling", tier: "Premium", color: "text-neon-cyan" },
  { num: "06", id: "ch-006", title: "Multi-Agent Patterns", tier: "Premium", color: "text-neon-cyan" },
  { num: "07", id: "ch-007", title: "Agent Memory Systems", tier: "Premium", color: "text-neon-cyan" },
  { num: "08", id: "ch-008", title: "Production Agent Deployment", tier: "Premium", color: "text-neon-cyan" },
  { num: "09", id: "ch-009", title: "Cost Optimization for Agents", tier: "Premium", color: "text-neon-cyan" },
  { num: "10", id: "ch-010", title: "Agent Factory Architecture", tier: "Premium", color: "text-neon-cyan" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-bold neon-text">Course Companion FTE</span>
        </div>
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
              Dashboard →
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            <div className="neon-badge mb-6">⚡ GIAIC Hackathon IV — Digital FTE</div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-white">Master</span>{" "}
              <span className="neon-text">AI Agent</span>
              <br />
              <span className="text-white">Development</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Learn Claude Agent SDK, MCP Protocol, Agent Skills, and Agent Factory Architecture —
              guided by a{" "}
              <span className="text-neon-cyan font-semibold">Digital Full-Time Equivalent</span>{" "}
              tutor that never sleeps.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-base px-8 py-3">
                    🚀 Start Learning Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                  🚀 Go to Dashboard
                </Link>
              </SignedIn>
              <Link href="#pricing" className="btn-secondary text-base px-8 py-3">
                View Pricing ↓
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-800 pt-8">
              {[
                { value: "10", label: "Chapters" },
                { value: "5", label: "Quizzes" },
                { value: "24/7", label: "AI Tutor" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold neon-text">{s.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Code preview card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-neon-cyan/5 rounded-2xl blur-2xl" />
            <div className="relative bg-gray-900 border border-neon-cyan/20 rounded-2xl overflow-hidden shadow-neon-cyan/10">
              {/* Terminal bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-950 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-neon-pink/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-neon-green/60" />
                <span className="text-xs text-gray-600 ml-2 font-mono">agent.py</span>
              </div>
              {/* Code */}
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div><span className="text-neon-purple">import</span> <span className="text-neon-cyan">anthropic</span></div>
                <div className="mt-2"><span className="text-gray-500"># Create your first AI Agent</span></div>
                <div className="mt-2">
                  <span className="text-neon-cyan">client</span>
                  <span className="text-white"> = anthropic.</span>
                  <span className="text-neon-green">Anthropic</span>
                  <span className="text-white">()</span>
                </div>
                <div className="mt-3">
                  <span className="text-neon-purple">def</span>{" "}
                  <span className="text-neon-green">run_agent</span>
                  <span className="text-white">(goal):</span>
                </div>
                <div className="pl-4">
                  <span className="text-neon-cyan">response</span>
                  <span className="text-white"> = client.messages.</span>
                  <span className="text-neon-green">create</span>
                  <span className="text-white">(</span>
                </div>
                <div className="pl-8">
                  <span className="text-neon-yellow">model</span>
                  <span className="text-white">=</span>
                  <span className="text-yellow-300">"claude-sonnet-4"</span>
                  <span className="text-white">,</span>
                </div>
                <div className="pl-8">
                  <span className="text-neon-yellow">messages</span>
                  <span className="text-white">=[&#123;</span>
                  <span className="text-yellow-300">"role"</span>
                  <span className="text-white">: </span>
                  <span className="text-yellow-300">"user"</span>
                  <span className="text-white">, </span>
                  <span className="text-yellow-300">"content"</span>
                  <span className="text-white">: goal&#125;]</span>
                </div>
                <div className="pl-4"><span className="text-white">)</span></div>
                <div className="pl-4">
                  <span className="text-neon-purple">return</span>{" "}
                  <span className="text-neon-cyan">response</span>
                  <span className="text-white">.content[</span>
                  <span className="text-neon-pink">0</span>
                  <span className="text-white">].text</span>
                </div>
              </div>
              {/* Output bar */}
              <div className="px-5 py-4 bg-gray-950/80 border-t border-gray-800">
                <div className="text-xs text-gray-600 mb-1 font-mono">output</div>
                <div className="text-neon-green text-sm font-mono">
                  ✓ Agent initialized successfully
                </div>
                <div className="text-gray-400 text-xs font-mono mt-1">
                  &gt; Ready to complete your goals 24/7
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-neon-purple/20 border border-neon-purple/40 rounded-lg px-3 py-2 text-xs font-semibold text-neon-purple backdrop-blur-sm">
              Claude Agent SDK
            </div>
            <div className="absolute -bottom-4 -left-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg px-3 py-2 text-xs font-semibold text-neon-cyan backdrop-blur-sm">
              MCP Protocol
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title mb-3">
            Everything to Build{" "}
            <span className="neon-text">AI Agents</span>
          </h2>
          <p className="text-gray-500">From zero to production-ready agent systems</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              href="/dashboard"
              className={`card group border border-gray-800 ${f.border} transition-all duration-300 block`}
            >
              <div className={`text-3xl mb-4 ${f.color}`}>{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              <div className="text-xs text-gray-700 group-hover:text-neon-cyan mt-3 transition-colors">Explore →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title mb-3">
            Course <span className="neon-text">Curriculum</span>
          </h2>
          <p className="text-gray-500">10 chapters from basics to advanced</p>
        </div>
        <div className="space-y-3">
          {curriculum.map((ch) => (
            <Link
              key={ch.num}
              href={ch.tier === "Free" ? `/learn/${ch.id}` : "/premium"}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg px-5 py-4 hover:border-neon-cyan/40 transition-all duration-200 group cursor-pointer"
            >
              <span className={`text-sm font-mono font-bold ${ch.color} w-8`}>{ch.num}</span>
              <span className="flex-1 text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                {ch.title}
              </span>
              <span className="text-xs text-gray-600 group-hover:text-neon-cyan transition-colors mr-2">
                {ch.tier === "Free" ? "Start →" : "Unlock →"}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  ch.tier === "Free"
                    ? "border-neon-green/40 text-neon-green bg-neon-green/10"
                    : "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10"
                }`}
              >
                {ch.tier}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title mb-3">
            Simple <span className="neon-text">Pricing</span>
          </h2>
          <p className="text-gray-500">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col bg-gray-900 border rounded-xl p-6 transition-all duration-300 ${tier.color}`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-neon-purple text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="mb-5">
                <div className="text-3xl font-extrabold text-white">
                  {tier.price}
                  {tier.period && (
                    <span className="text-sm font-normal text-gray-500">{tier.period}</span>
                  )}
                </div>
                <div className="font-bold text-white mt-1">{tier.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tier.description}</div>
              </div>
              <ul className="flex-1 space-y-2.5 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-neon-green mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`text-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 ${tier.btnClass}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="card-glow">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to build{" "}
            <span className="neon-text">AI Agents</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of developers learning with Course Companion FTE.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary text-base px-10 py-3">
                  🚀 Start for Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-primary text-base px-10 py-3">
                🚀 Go to Dashboard
              </Link>
            </SignedIn>
            <Link href="/learn/ch-001" className="btn-neon-purple text-base px-10 py-3">
              📖 Read Chapter 1
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center text-sm text-gray-600 py-8 border-t border-gray-800">
        <span className="neon-text font-semibold">Course Companion FTE</span> — Built for GIAIC Hackathon IV
      </footer>
    </main>
  );
}
