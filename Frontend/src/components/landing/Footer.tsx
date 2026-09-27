"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-paper-soft border-t border-border-subtle pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20"><Sparkles size={18} /></div>
              <span className="font-display text-lg font-extrabold text-ink">AI Resume Analyzer</span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed">AI-powered resume analysis, ATS optimization, and job application tracking for modern career seekers.</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-extrabold text-ink uppercase tracking-wider mb-3">Product</h4>
            <div className="space-y-2 text-sm"><a href="#analyzer" className="block text-ink-muted hover:text-brand transition">Resume Analyzer</a><a href="#ats" className="block text-ink-muted hover:text-brand transition">ATS Checker</a><a href="#match" className="block text-ink-muted hover:text-brand transition">Job Matching</a><a href="#tracker" className="block text-ink-muted hover:text-brand transition">Job Tracker</a></div>
          </div>
          <div>
            <h4 className="font-display text-sm font-extrabold text-ink uppercase tracking-wider mb-3">Resources</h4>
            <div className="space-y-2 text-sm"><a href="#how-it-works" className="block text-ink-muted hover:text-brand transition">How It Works</a><a href="#faq" className="block text-ink-muted hover:text-brand transition">Career Tips</a><a href="#faq" className="block text-ink-muted hover:text-brand transition">FAQ</a></div>
          </div>
          <div>
            <h4 className="font-display text-sm font-extrabold text-ink uppercase tracking-wider mb-3">Account</h4>
            <div className="space-y-2 text-sm"><Link href="/login" className="block text-ink-muted hover:text-brand transition">Login</Link><Link href="/signup" className="block text-ink-muted hover:text-brand transition">Sign Up</Link></div>
            <h4 className="font-display text-sm font-extrabold text-ink uppercase tracking-wider mb-3 mt-6">Legal</h4>
            <div className="space-y-2 text-sm"><a href="#" className="block text-ink-muted hover:text-brand transition">Privacy Policy</a><a href="#" className="block text-ink-muted hover:text-brand transition">Terms of Service</a></div>
          </div>
        </div>
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">© 2026 AI Resume Analyzer. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-ink-muted"><a href="#" className="hover:text-brand">Privacy</a><a href="#" className="hover:text-brand">Terms</a></div>
        </div>
      </div>
    </footer>
  );
}
