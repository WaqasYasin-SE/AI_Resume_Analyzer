"use client";

import { FileWarning, SearchX, FileText, CalendarClock } from "lucide-react";

export default function Problem() {
  const cards = [
    { icon: FileWarning, title: "Low ATS Compatibility", desc: "Your resume may not contain the structure and keywords ATS systems expect." },
    { icon: SearchX, title: "Missing Skills", desc: "Important skills from your target jobs may be missing from your resume." },
    { icon: FileText, title: "Weak Resume Content", desc: "Your experience may not be presented strongly enough to stand out." },
    { icon: CalendarClock, title: "Disorganized Job Search", desc: "Applications, interviews, deadlines, and follow-ups can become difficult to manage." },
  ];

  return (
    <section id="problem" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Your resume might be costing you interviews</h2>
          <p className="mt-4 text-lg text-ink-muted">Most job seekers never realize their resume is being filtered out before a human reads it.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <article key={c.title} className="group rounded-3xl bg-white border border-border-subtle p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-300">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-paper-warm text-brand shadow-sm">
                <c.icon size={22} strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">{c.title}</h3>
              <p className="text-[0.95rem] text-ink-muted leading-relaxed">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
