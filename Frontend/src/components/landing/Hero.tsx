"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
      <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-brand-glow rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-brand-soft rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-60 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-border-subtle px-4 py-1.5 shadow-sm shadow-black/[0.03] mb-8 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              <span className="text-[0.78rem] font-semibold text-ink-secondary">New: AI Job Matching & ATS Score</span>
            </div>

            <h1 className="font-display text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
              Turn Your Resume Into a <span className="relative inline-block">Job-Winning Resume
                <svg className="absolute left-0 bottom-2 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" height="12"><path d="M0 6 Q75 0 150 6 T300 6" fill="none" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" opacity="0.35" /></svg>
              </span>
            </h1>

            <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-muted max-w-xl">
              Analyze your resume with AI, discover what recruiters are missing, improve your ATS score, and track your job applications—all in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[0.92rem] font-bold bg-ink text-white shadow-xl shadow-ink/15 hover:bg-ink/90 transition-all hover:-translate-y-1">
                Analyze My Resume <ArrowRight size={17} />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.92rem] font-semibold bg-white text-ink border border-border-subtle hover:border-brand/40 shadow-sm hover:shadow-md transition-all">
                See How It Works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-ink-muted">
              {["No credit card required", "Free resume score", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand" /> {t}</span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-border-subtle shadow-2xl shadow-black/[0.08] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-extrabold text-ink">Resume Score</h3>
                  <p className="text-sm text-ink-muted">AI Analysis Preview</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Zap size={22} />
                </div>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="font-display text-7xl font-black text-ink leading-none tracking-tighter">82</span>
                <div className="mb-3">
                  <span className="text-sm font-bold text-brand">/ 100</span>
                  <div className="mt-1 h-2 w-32 rounded-full bg-paper-warm overflow-hidden"><div className="h-full w-[82%] rounded-full bg-gradient-to-r from-brand to-brand-dark" /></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl bg-paper-soft p-4 border border-border-light">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">Strengths</div>
                  <div className="text-sm font-medium text-ink">Strong technical skills</div>
                  <div className="text-sm font-medium text-ink">Relevant projects</div>
                </div>
                <div className="rounded-2xl bg-caution-soft/40 p-4 border border-caution/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-caution mb-1">Needs Work</div>
                  <div className="text-sm font-medium text-ink-secondary">Add measurable achievements</div>
                  <div className="text-sm font-medium text-ink-secondary">Improve keyword coverage</div>
                </div>
              </div>

              <div className="rounded-2xl bg-ink text-white p-5 shadow-xl shadow-ink/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-display text-lg font-extrabold">ATS Compatibility</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">82%</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-white/50">Keywords</span><div className="font-semibold">88%</div></div>
                  <div><span className="text-white/50">Structure</span><div className="font-semibold">92%</div></div>
                  <div><span className="text-white/50">Skills Match</span><div className="font-semibold">76%</div></div>
                  <div><span className="text-white/50">Experience</span><div className="font-semibold">81%</div></div>
                </div>
              </div>
            </div>

            <div className="absolute -top-8 -right-4 bg-white rounded-2xl shadow-2xl border border-border-subtle p-4 w-56 hidden md:block animate-[slideIn_0.8s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-brand" />
                <span className="text-xs font-bold text-ink">Job Match</span>
              </div>
              <div className="font-display text-3xl font-black text-ink">87%</div>
              <div className="text-xs text-ink-muted">Backend Developer</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {["Python", "FastAPI", "PostgreSQL"].map((s) => (
                  <span key={s} className="rounded-lg bg-brand-soft text-brand-dark text-[0.7rem] font-bold px-1.5 py-0.5">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
