"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/app/providers";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Resume Analysis", href: "#analyzer" },
    { label: "Job Tracker", href: "#tracker" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex h-20 items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition">
              <Sparkles
                size={18}
                strokeWidth={2.5}
              />
            </div>

            <div className="leading-none">
              <span className="block font-display text-[1.05rem] font-extrabold tracking-tight text-ink">
                AI Resume Analyzer
              </span>

              <span className="block text-[0.65rem] font-medium text-ink-muted tracking-wide">
                AI-powered career tools
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-[0.82rem] font-medium text-ink-secondary hover:text-ink hover:bg-paper-warm transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">

            {!loading && !user && (
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 text-[0.82rem] font-semibold text-ink-secondary hover:text-ink transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              href="/signup"
              className="rounded-full px-5 py-2.5 text-[0.82rem] font-semibold bg-ink text-white shadow-lg shadow-ink/20 hover:bg-ink/90 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>

          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-paper-warm transition"
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-border-subtle shadow-xl">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-2">

            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-ink-secondary hover:text-ink hover:bg-paper-warm transition"
              >
                {l.label}
              </a>
            ))}

            <div className="mt-3 flex flex-col gap-2">

              {!loading && !user && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-5 py-3 text-center font-semibold text-ink-secondary border border-border-subtle"
                >
                  Login
                </Link>
              )}

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-xl px-5 py-3 text-center font-semibold bg-ink text-white"
              >
                Get Started
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}