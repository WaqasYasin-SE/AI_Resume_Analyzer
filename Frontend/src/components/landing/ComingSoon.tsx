"use client";

import { Clock } from "lucide-react";

export default function ComingSoon() {
  const items = [
    { title: "AI Cover Letter Generator", desc: "Write tailored cover letters in minutes." },
    { title: "AI Interview Preparation", desc: "Practice with realistic mock interviews." },
    { title: "Career Roadmap", desc: "Build a personalized growth path." },
    { title: "Personalized Skill Recommendations", desc: "Learn exactly what to study next." },
    { title: "AI Career Assistant", desc: "Get answers to career questions anytime." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">More AI career tools are coming</h2>
          <p className="mt-4 text-lg text-ink-muted">We are expanding our toolkit to support every stage of your career journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article key={item.title} className="relative rounded-3xl bg-white border border-border-subtle p-7 shadow-sm overflow-hidden">
              <div className="absolute top-4 right-4"><span className="inline-flex items-center gap-1 rounded-full bg-brand-soft text-brand-dark text-[0.7rem] font-extrabold px-2 py-0.5">Coming Soon</span></div>
              <h3 className="font-display text-xl font-extrabold text-ink mb-2">{item.title}</h3>
              <p className="text-[0.95rem] text-ink-muted leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
