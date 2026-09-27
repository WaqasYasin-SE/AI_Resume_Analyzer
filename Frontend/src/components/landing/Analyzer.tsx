"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function Analyzer() {
  return (
    <section id="analyzer" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Know exactly what needs to improve</h2>
            <p className="mt-5 text-lg text-ink-muted leading-relaxed">Our AI examines every dimension of your resume—structure, skills, experience, keywords, and content quality—so you get precise recommendations instead of vague advice.</p>

            <ul className="mt-8 space-y-3">
              {["Resume structure & formatting", "Skills vs target roles", "Experience presentation", "Education & projects", "Keyword coverage", "Content quality & impact", "ATS compatibility score"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base font-medium text-ink-secondary"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Check size={14} strokeWidth={3} /></span> {item}</li>
              ))}
            </ul>

            <Link href="/signup" className="inline-flex items-center gap-2 mt-10 rounded-full px-7 py-3.5 text-[0.92rem] font-bold bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all hover:-translate-y-1">
              Analyze Your Resume <ArrowRight size={17} />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-paper-soft border border-border-subtle shadow-2xl shadow-black/[0.06] overflow-hidden">
              <div className="bg-ink px-6 py-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-brand" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-rose-300" />
                <span className="ml-2 text-xs font-bold text-white/70 uppercase tracking-widest">AI Analysis Report</span>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2"><span className="font-display text-3xl font-black text-ink">82 <span className="text-xl font-bold text-ink-muted">/ 100</span></span><span className="rounded-full bg-brand-soft text-brand-dark text-xs font-extrabold px-2.5 py-0.5">Good</span></div>
                  <div className="h-3 w-full rounded-full bg-paper-warm overflow-hidden"><div className="h-full w-[82%] rounded-full bg-gradient-to-r from-brand to-brand-dark" /></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white border border-border-subtle p-5 shadow-sm">
                    <h4 className="font-display text-lg font-extrabold text-ink mb-3">Strengths</h4>
                    <ul className="space-y-2 text-sm text-ink-secondary font-medium"><li>✓ Strong technical skills</li><li>✓ Relevant projects</li><li>✓ Clear educational background</li></ul>
                  </div>
                  <div className="rounded-2xl bg-caution-soft/40 border border-caution/15 p-5 shadow-sm">
                    <h4 className="font-display text-lg font-extrabold text-ink mb-3">Needs Improvement</h4>
                    <ul className="space-y-2 text-sm text-ink-secondary font-medium"><li>• Add measurable achievements</li><li>• Improve keyword coverage</li><li>• Strengthen professional summary</li></ul>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-border-subtle p-5 shadow-sm">
                  <h4 className="font-display text-base font-extrabold text-ink mb-3">Suggested Improvements</h4>
                  <div className="space-y-2 text-sm text-ink-secondary font-medium">
                    <div className="flex gap-2"><span className="text-brand">→</span> Quantify results with numbers and percentages</div>
                    <div className="flex gap-2"><span className="text-brand">→</span> Include target keywords from job descriptions</div>
                    <div className="flex gap-2"><span className="text-brand">→</span> Write a stronger professional summary</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
