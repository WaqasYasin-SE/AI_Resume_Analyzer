"use client";

import { Sparkles, ShieldCheck, LineChart, ClipboardList } from "lucide-react";

export default function Trust() {
  const items = [
    { icon: Sparkles, label: "AI-Powered Analysis", desc: "Deep resume insights" },
    { icon: ShieldCheck, label: "ATS Optimization", desc: "Pass filtering systems" },
    { icon: LineChart, label: "Job Matching", desc: "Compare to roles" },
    { icon: ClipboardList, label: "Application Tracking", desc: "Organize your search" },
  ];

  return (
    <section className="relative z-10 -mt-10 mx-auto max-w-6xl px-6 md:px-10">
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-border-subtle shadow-2xl shadow-black/[0.05] px-6 py-7 md:px-10 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-sm shadow-brand/10">
              <i.icon size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-display text-base font-extrabold text-ink leading-tight">{i.label}</div>
              <div className="text-sm text-ink-muted">{i.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
