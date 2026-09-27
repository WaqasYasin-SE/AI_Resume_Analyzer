"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: "Is the resume analysis free?", a: "Yes. Our resume score, ATS compatibility check, and basic job matching are free to use. Additional premium features include advanced skill gap reports and unlimited resume versions." },
    { q: "What resume formats are supported?", a: "We support PDF, DOCX, and plain text uploads. Our AI reads structure, keywords, and formatting to provide accurate feedback." },
    { q: "Does AI store my resume?", a: "Your resume is stored securely so you can access it anytime. We do not sell or share your data with third parties." },
    { q: "Can I analyze my resume against a job?", a: "Yes. Paste a job description and get an instant comparison showing matched skills, missing skills, and an overall match score." },
    { q: "Can I track job applications?", a: "Yes. Our job tracker lets you save jobs, update statuses, add notes, and manage deadlines from one dashboard." },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] text-ink leading-[1.1] text-center mb-14">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl bg-paper-soft border border-border-subtle overflow-hidden shadow-sm">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-display text-base font-bold text-ink hover:text-brand transition-colors">
                <span>{f.q}</span>
                <ChevronDown size={20} className={`shrink-0 text-brand transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="px-6 pb-5 text-[0.95rem] text-ink-muted leading-relaxed">{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
