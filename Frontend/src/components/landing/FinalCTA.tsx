"use client";

import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 lg:py-32 bg-ink relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vw] bg-brand/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-10 text-center">
        <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-[-0.03em] text-white leading-[1.1]">Your next opportunity starts with a better resume.</h2>
        <p className="mt-6 text-xl text-white/70 leading-relaxed">Analyze your resume, discover your gaps, and take control of your job search.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[0.95rem] font-bold bg-brand text-white shadow-xl shadow-brand/30 hover:bg-brand-dark transition-all hover:-translate-y-1">Get Started Free <ArrowRight size={18} /></Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[0.95rem] font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/15 transition-all">Already have an account? Login <LogIn size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
