"use client";

import { Target, FileCode } from "lucide-react";

export default function ATS() {
  const metrics = [
    { label: "Keywords", value: 88 },
    { label: "Structure", value: 92 },
    { label: "Skills Match", value: 76 },
    { label: "Experience", value: 81 },
  ];

  return (
    <section id="ats" className="py-24 lg:py-32 bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl bg-ink text-white p-8 md:p-10 shadow-2xl shadow-ink/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-[60px] -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6"><div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center"><Target size={18} /></div><h3 className="font-display text-2xl font-extrabold">ATS Compatibility</h3></div>
                <div className="flex items-baseline gap-2 mb-2"><span className="font-display text-8xl font-black tracking-tighter">82%</span></div>
                <p className="text-white/70 mb-8">Understand how well your resume matches employer and ATS requirements.</p>
                <div className="grid grid-cols-2 gap-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl bg-white/8 border border-white/10 p-4 backdrop-blur-sm">
                      <div className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-1">{m.label}</div>
                      <div className="font-display text-2xl font-extrabold">{m.value}%</div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 mt-2 overflow-hidden"><div className="h-full rounded-full bg-brand" style={{ width: `${m.value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Optimize your resume for ATS</h2>
            <p className="mt-5 text-lg text-ink-muted leading-relaxed">Understand how well your resume matches the requirements employers and applicant tracking systems look for. Fix the gaps that silently block your applications.</p>
            <div className="mt-8 flex items-start gap-4 rounded-2xl bg-white border border-border-subtle p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><FileCode size={20} /></div>
              <div>
                <h4 className="font-display text-base font-extrabold text-ink">Keyword Coverage</h4>
                <p className="text-sm text-ink-muted mt-1">We scan your resume against real job descriptions and flag missing keywords that ATS filters check for.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
