
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";

import { useAuth } from "@/app/providers";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();

  const {
    signup,
    user,
    loading: authLoading,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signup(
        email,
        password,
        name.trim() || undefined
      );

      if (!result.success) {
        setError(result.error || "Signup failed");
        return;
      }

      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-paper-soft flex items-center justify-center">
        <div className="text-sm font-medium text-ink-muted">
          Loading...
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-paper-soft flex items-center justify-center">
        <div className="text-sm font-medium text-ink-muted">
          Redirecting to dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper-soft flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2.5 mx-auto mb-8 w-fit"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg">
            <Sparkles size={18} />
          </div>

          <span className="font-display text-xl font-extrabold text-ink">
            AI Resume Analyzer
          </span>
        </Link>

        <div className="rounded-3xl bg-white border border-border-subtle shadow-2xl shadow-black/[0.06] p-8 md:p-10">
          <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight">
            Create an account
          </h1>

          <p className="mt-2 text-ink-muted">
            Start analyzing your resume and tracking applications.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium px-4 py-3 border border-rose-100"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-ink mb-1.5"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition bg-paper-soft"
                placeholder="Alex Johnson"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-ink mb-1.5"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition bg-paper-soft"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-ink mb-1.5"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition bg-paper-soft pr-10"
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPwd((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  aria-label={
                    showPwd
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPwd ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-5 py-3.5 text-sm font-bold bg-ink text-white shadow-lg shadow-ink/15 hover:bg-ink/90 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating account..."
                : "Get Started Free"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-brand hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

