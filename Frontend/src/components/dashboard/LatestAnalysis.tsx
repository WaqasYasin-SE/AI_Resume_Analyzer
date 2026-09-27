"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type ResumeAnalysis = {
    score: number;
    summary: string;
    strengths: string[];
    recommendations: string[];
};

type LatestAnalysisProps = {
    analysis: ResumeAnalysis | null;
    resumeId?: number;
    resumeStatus?: string;
    onUpload: () => void;
};

export default function LatestAnalysis({
    analysis,
    resumeId,
    resumeStatus,
    onUpload,
}: LatestAnalysisProps) {
    const status = resumeStatus?.toLowerCase();

    return (
        <div className="lg:col-span-5 rounded-3xl bg-ink text-white p-6 md:p-8 shadow-2xl shadow-ink/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/15 rounded-full blur-[60px] -translate-y-1/3 translate-x-1/3" />

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-extrabold">
                        Latest Analysis
                    </h2>

                    {analysis && (
                        <Sparkles
                            size={20}
                            className="text-brand"
                        />
                    )}
                </div>

                {analysis ? (
                    <>
                        <div className="flex items-baseline gap-2 mt-6 mb-4">
                            <span className="font-display text-7xl font-black tracking-tighter">
                                {analysis.score}
                            </span>

                            <span className="text-xl font-medium text-white/60">
                                / 100
                            </span>
                        </div>

                        <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden mb-6">
                            <div
                                className="h-full rounded-full bg-brand transition-all"
                                style={{
                                    width: `${Math.min(
                                        analysis.score,
                                        100
                                    )}%`,
                                }}
                            />
                        </div>

                        <div className="rounded-2xl bg-white/8 border border-white/10 p-4 mb-4">
                            <div className="text-xs text-white/50 font-bold uppercase mb-2">
                                Summary
                            </div>

                            <p className="text-sm text-white/70 leading-relaxed line-clamp-4">
                                {analysis.summary}
                            </p>
                        </div>

                        {resumeId && (
                            <Link
                                href={`/resumes/${resumeId}`}
                                className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-white transition"
                            >
                                View full analysis
                                <ArrowRight size={15} />
                            </Link>
                        )}
                    </>
                ) : (
                    <div className="mt-8">
                        <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                            <Sparkles
                                size={28}
                                className="text-white/60"
                            />
                        </div>

                        <h3 className="font-display text-2xl font-extrabold">
                            No analysis yet
                        </h3>

                        <p className="text-sm text-white/60 mt-2 mb-6 leading-relaxed">
                            {resumeId &&
                                (status === "processing" ||
                                    status === "pending")
                                ? "Your resume is being analyzed. Check back shortly."
                                : "Upload your resume and let AI analyze your skills, experience and overall resume quality."}
                        </p>

                        <button
                            type="button"
                            onClick={onUpload}
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-brand text-white text-sm font-bold"
                        >
                            Upload Resume
                            <ArrowRight size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}