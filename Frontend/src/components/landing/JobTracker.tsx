"use client";

import { Search, Filter } from "lucide-react";

export default function JobTracker() {
  const apps = [
    { company: "Stripe", position: "Senior Frontend Engineer", status: "Interview", applied: "Oct 12", interview: "Oct 18", notes: "Technical round next week" },
    { company: "Notion", position: "Product Designer", status: "Screening", applied: "Oct 10", interview: "—", notes: "Portfolio reviewed" },
    { company: "Vercel", position: "Engineer, Platform", status: "Applied", applied: "Oct 14", interview: "—", notes: "Waiting for response" },
    { company: "Linear", position: "Founding Engineer", status: "Offer", applied: "Sep 28", interview: "Oct 05", notes: "Negotiating comp" },
  ];

  const stats = [
    { label: "Applied", value: 24 },
    { label: "Interviews", value: 6 },
    { label: "Offers", value: 2 },
    { label: "Rejected", value: 3 },
  ];

  return (
    <section id="tracker" className="py-24 lg:py-32 bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1]">Stop losing track of your applications</h2>
          <p className="mt-4 text-lg text-ink-muted">Keep your entire job search organized in one place. Track statuses, deadlines, notes, and follow-ups from a single dashboard.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-border-subtle shadow-xl shadow-black/[0.04] overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle flex flex-wrap items-center gap-3">
              <h3 className="font-display text-lg font-extrabold text-ink">Recent Applications</h3>
              <div className="ml-auto flex items-center gap-2">
                <div className="relative"><Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" /><input placeholder="Search..." className="pl-8 pr-3 py-1.5 text-sm rounded-full bg-paper-soft border border-border-subtle focus:outline-none focus:border-brand/40 w-48" /></div>
                <button className="p-1.5 rounded-full bg-paper-soft border border-border-subtle hover:border-brand/40 transition"><Filter size={16} className="text-ink-muted" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-paper-soft text-xs font-bold uppercase tracking-wider text-ink-muted"><tr><th className="px-6 py-3">Company</th><th className="px-6 py-3">Position</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Applied</th><th className="px-6 py-3">Notes</th></tr></thead>
                <tbody className="divide-y divide-border-light">
                  {apps.map((a) => (
                    <tr key={a.company + a.position} className="hover:bg-paper-soft/60 transition"><td className="px-6 py-3 font-semibold text-ink">{a.company}</td><td className="px-6 py-3 text-ink-secondary">{a.position}</td><td className="px-6 py-3"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold ${a.status === "Interview" ? "bg-brand-soft text-brand-dark" : a.status === "Offer" ? "bg-amber-50 text-amber-700" : a.status === "Screening" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{a.status}</span></td><td className="px-6 py-3 text-ink-muted">{a.applied}</td><td className="px-6 py-3 text-ink-muted">{a.notes}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-ink text-white p-7 shadow-2xl shadow-ink/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-brand/15 rounded-full blur-[60px] -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10">
              <h3 className="font-display text-xl font-extrabold mb-1">Your Pipeline</h3>
              <p className="text-white/60 text-sm mb-6">Quick overview of where you stand.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/8 border border-white/10 p-4"><div className="font-display text-3xl font-black">{s.value}</div><div className="text-xs text-white/60 font-medium">{s.label}</div></div>
                ))}
              </div>
              <div className="space-y-3">
                {["Applied", "Screening", "Interview", "Offer", "Rejected"].map((st) => (
                  <div key={st} className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-brand" /><span className="text-sm font-medium">{st}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
