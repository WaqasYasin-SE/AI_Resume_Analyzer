"use client";

import Link from "next/link";
import { ArrowRight, UserPlus, UploadCloud, Sparkles, LayoutDashboard } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { num: "01", icon: UserPlus, title: "Create Your Account", desc: "Sign up and access your personal career dashboard in seconds." },
    { num: "02", icon: UploadCloud, title: "Upload Your Resume", desc: "Upload your resume and let the system extract and analyze its content." },
    { num: "03", icon: Sparkles, title: "Get AI Insights", desc: "Receive your resume score, strengths, weaknesses, missing skills, and recommendations." },
    { num: "04", icon: LayoutDashboard, title: "Track Your Applications", desc: "Save jobs and manage your application progress from one dashboard." },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">How it works</h2>
          <p className="mt-4 text-lg text-ink-muted">Four simple steps from resume upload to organized job search.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((s) => (
            <article key={s.num} className="group rounded-3xl bg-paper-soft border border-border-subtle p-8 shadow-sm hover:shadow-xl hover:shadow-black/[0.05] hover:-translate-y-1 transition-all duration-300">
              <div className="mb-5 flex items-center gap-3">
                <span className="font-display text-4xl font-black text-brand/20 leading-none">{s.num}</span>
                <div className="h-10 w-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20"><s.icon size={20} /></div>
              </div>
              <h3 className="font-display text-xl font-extrabold text-ink mb-2">{s.title}</h3>
              <p className="text-[0.95rem] text-ink-muted leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[0.95rem] font-bold bg-ink text-white shadow-2xl shadow-ink/20 hover:bg-ink/90 transition-all hover:-translate-y-1">Get Started Free <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
