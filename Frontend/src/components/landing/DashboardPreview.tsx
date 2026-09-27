"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Your personal career workspace</h2>
          <p className="mt-4 text-lg text-ink-muted">After sign-up, everything lives in one dashboard—resume scores, applications, interviews, and skill insights.</p>
        </div>

        <div className="rounded-3xl bg-ink text-white shadow-2xl shadow-ink/20 overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-0">
            <aside className="lg:col-span-3 bg-ink/60 border-r border-white/10 p-6">
              <div className="font-display text-xl font-extrabold mb-6">Career Hub</div>
              <nav className="space-y-1">
                {["Dashboard", "Resume Analysis", "Job Matches", "Applications", "Settings"].map((item) => (
                  <a key={item} href="#" className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${item === "Dashboard" ? "bg-brand text-white shadow-lg shadow-brand/25" : "text-white/70 hover:text-white hover:bg-white/5"}`}>{item}</a>
                ))}
              </nav>
            </aside>

            <main className="lg:col-span-9 p-6 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display text-2xl font-extrabold">Welcome back, Alex</h3>
                  <p className="text-sm text-white/60">Your career progress at a glance.</p>
                </div>
                <span className="rounded-full bg-brand/20 text-brand-soft text-xs font-extrabold px-3 py-1">Premium Plan</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Resume Score", value: "82%", sub: "+4 this week" },
                  { label: "Applications", value: "24", sub: "This month" },
                  { label: "Interviews", value: "6", sub: "Scheduled" },
                  { label: "Offers", value: "2", sub: "In progress" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/8 border border-white/10 p-5 backdrop-blur-sm"><div className="text-xs font-bold text-white/50 uppercase tracking-wider">{s.label}</div><div className="font-display text-3xl font-black mt-1">{s.value}</div><div className="text-xs text-brand-soft font-semibold mt-1">{s.sub}</div></div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-white/8 border border-white/10 p-6">
                  <h4 className="font-display text-lg font-extrabold mb-4">Recent Applications</h4>
                  <div className="space-y-3">
                    {[{ company: "Stripe", pos: "Frontend Engineer", status: "Interview", date: "Oct 14" }, { company: "Linear", pos: "Founding Engineer", status: "Offer", date: "Oct 12" }, { company: "Notion", pos: "Product Designer", status: "Applied", date: "Oct 10" }].map((a) => (
                      <div key={a.company} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10 transition"><div><div className="font-semibold text-white">{a.company}</div><div className="text-xs text-white/50">{a.pos}</div></div><div className="text-right"><span className={`inline-block rounded-full text-xs font-bold px-2 py-0.5 ${a.status === "Offer" ? "bg-amber-400/90 text-ink" : a.status === "Interview" ? "bg-brand/30 text-brand-soft" : "bg-white/10 text-white/70"}`}>{a.status}</span><div className="text-xs text-white/40 mt-1">{a.date}</div></div></div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/8 border border-white/10 p-6">
                  <h4 className="font-display text-lg font-extrabold mb-4">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "FastAPI", "PostgreSQL", "React", "TypeScript", "Tailwind"].map((s) => <span key={s} className="rounded-lg bg-brand/20 text-brand-soft text-xs font-bold px-2.5 py-1">{s}</span>)}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[0.95rem] font-bold bg-brand text-white shadow-xl shadow-brand/25 hover:bg-brand-dark transition-all hover:-translate-y-1">Build Your Career Dashboard <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
