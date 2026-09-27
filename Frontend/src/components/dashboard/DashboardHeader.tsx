"use client";

import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

type DashboardHeaderProps = {
    userName?: string;
    onUpload: () => void;
};

export default function DashboardHeader({
    userName,
    onUpload,
}: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
                    Welcome back, {userName || "there"}
                </h1>

                <p className="mt-2 text-ink-muted">
                    Your resume and career progress at a glance.
                </p>
            </div>

            <button
                type="button"
                onClick={onUpload}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark transition"
            >
                <Plus size={16} />
                New Resume
            </button>
        </div>
    );
} 