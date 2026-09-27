"use client";

import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

export default function JobMatch() {
  return (
    <section id="match" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Find out how well your resume matches a job</h2>
            <p className="mt-5 text-lg text-ink-muted leading-relaxed">Provide a job description and receive an AI-powered comparison. See exactly which skills align, which are missing, and where to improve.</p>

            <div className="mt-8 rounded-3xl bg-paper-soft border border-border-subtle p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4"><span className="font-display text-xl font-extrabold text-ink">Backend Developer</span><span className="font-display text-3xl font-black text-brand">87%</span></div>
              <div className="h-3 w-full rounded-full bg-paper-warm overflow-hidden mb-5"><div className="h-full w-[87%] rounded-full bg-gradient-to-r from-brand to-brand-dark" /></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display text-sm font-extrabold text-ink mb-2">Matched Skills</h4>
                  <ul className="space-y-1.5 text-sm text-ink-secondary font-medium">{["Python", "FastAPI", "PostgreSQL", "REST APIs"].map(s => <li key={s} className="flex items-center gap-2"><Check size={14} className="text-brand" /> {s}</li>)}</ul>
                </div>
                <div>
                  <h4 className="font-display text-sm font-extrabold text-ink mb-2">Missing Skills</h4>
                  <ul className="space-y-1.5 text-sm text-ink-secondary font-medium">{["Docker", "Redis"].map(s => <li key={s} className="flex items-center gap-2"><X size={14} className="text-rose-400" /> {s}</li>)}</ul>
                </div>
              </div>
            </div>

            <Link href="/signup" className="inline-flex items-center gap-2 mt-8 rounded-full px-7 py-3.5 text-[0.92rem] font-bold bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all hover:-translate-y-1">Check Your Match <ArrowRight size={17} /></Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-ink text-white p-8 shadow-2xl shadow-ink/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand/15 rounded-full blur-[60px] -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-extrabold mb-2">Job Description</h3>
                <p className="text-white/70 text-sm mb-6">Paste a job posting and see how your resume stacks up in seconds.</p>
                <div className="rounded-2xl bg-white/8 border border-white/10 p-5 text-sm leading-relaxed text-white/90 mb-6">
                  We are looking for a Backend Developer experienced with Python, FastAPI, PostgreSQL, and REST APIs. Familiarity with Docker and Redis is a plus. You should have 2+ years of production experience and strong problem-solving skills.
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/30"><Check size={20} /></div>
                  <div>
                    <div className="font-display text-lg font-extrabold">82% Match</div>
                    <div className="text-xs text-white/60">With 3 missing skill gaps</div>
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
