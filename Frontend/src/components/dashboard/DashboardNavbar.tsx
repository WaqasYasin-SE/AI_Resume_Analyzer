
"use client";

import Link from "next/link";
import {
    Menu,
    Sparkles,
} from "lucide-react";

type DashboardNavbarProps = {
    userName?: string;
    onMenuClick?: () => void;
};

export default function DashboardNavbar({
    userName,
    onMenuClick,
}: DashboardNavbarProps) {
    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border-subtle">
            <div className="h-16 px-6 md:px-10 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-3">

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-paper-soft hover:text-ink transition"
                        aria-label="Open navigation"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 font-display text-lg font-extrabold text-ink"
                    >
                        <Sparkles
                            size={18}
                            className="text-brand"
                        />

                        AI Resume Analyzer
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center">
                    <div className="flex items-center gap-3 rounded-full px-3 py-1.5 hover:bg-paper-soft transition">
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-sm font-bold text-brand">
                            {(userName || "User")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <span className="hidden sm:inline text-sm font-bold text-ink">
                            {userName || "User"}
                        </span>
                    </div>
                </div>

            </div>
        </nav>
    );
}
