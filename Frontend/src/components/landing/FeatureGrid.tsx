"use client";

import { Sparkles, Target, Lightbulb, Briefcase, ClipboardList, Compass, Layers, TrendingUp } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    { icon: Sparkles, title: "AI Resume Analysis", desc: "Understand strengths and weaknesses with precise scoring." },
    { icon: Target, title: "ATS Score", desc: "Identify areas that may affect ATS compatibility." },
    { icon: Lightbulb, title: "Skill Gap Analysis", desc: "Discover skills missing from your target roles." },
    { icon: Briefcase, title: "Job Matching", desc: "Compare your resume with job descriptions instantly." },
    { icon: ClipboardList, title: "Application Tracker", desc: "Manage your job applications from one dashboard." },
    { icon: Compass, title: "AI Recommendations", desc: "Get actionable suggestions to improve your resume." },
    { icon: Layers, title: "Multiple Resumes", desc: "Keep different versions of your resume organized." },
    { icon: TrendingUp, title: "Career Insights", desc: "Build a clearer picture of your career strengths and gaps." },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Everything you need to improve</h2>
          <p className="mt-4 text-lg text-ink-muted">From AI analysis to application tracking, these tools work together to accelerate your job search.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <article key={f.title} className="group rounded-3xl bg-white border border-border-subtle p-7 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-300">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-sm shadow-brand/10"><f.icon size={22} strokeWidth={2.2} /></div>
              <h3 className="font-display text-lg font-extrabold text-ink mb-1.5">{f.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
