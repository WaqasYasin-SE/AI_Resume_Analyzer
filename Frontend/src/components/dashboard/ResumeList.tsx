"use client";

import Link from "next/link";
import {
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    Trash2,
} from "lucide-react";

export type DashboardResume = {
    id: number;
    original_filename: string;
    processing_status?: string;
    processing_error?: string | null;
};

type ResumeListProps = {
    resumes: DashboardResume[];
    onUpload: () => void;
    onDeleteRequest: (resume: DashboardResume) => void;
};

export default function ResumeList({
    resumes,
    onUpload,
    onDeleteRequest,
}: ResumeListProps) {
    const handleDeleteClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        resume: DashboardResume
    ) => {
        e.preventDefault();
        e.stopPropagation();

        onDeleteRequest(resume);
    };

    return (
        <div className="lg:col-span-7 rounded-3xl bg-white border border-border-subtle shadow-sm p-6 md:p-8">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-extrabold text-ink">
                    Your Resumes
                </h2>

                <Link
                    href="/resumes"
                    className="text-sm font-bold text-brand hover:underline flex items-center gap-1"
                >
                    View all
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Empty state */}

            {resumes.length === 0 ? (
                <div className="border border-dashed border-border-subtle rounded-2xl p-10 text-center">

                    <FileText
                        size={32}
                        className="mx-auto text-ink-muted mb-3"
                    />

                    <h3 className="font-bold text-ink">
                        No resumes yet
                    </h3>

                    <p className="text-sm text-ink-muted mt-1 mb-5">
                        Upload your first resume to start the AI analysis.
                    </p>

                    <button
                        type="button"
                        onClick={onUpload}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-brand text-white text-sm font-bold hover:bg-brand-dark transition"
                    >
                        Upload Resume
                        <Plus size={15} />
                    </button>
                </div>
            ) : (

                /* Resume list */

                <div className="space-y-3">

                    {resumes.slice(0, 5).map((resume) => {
                        const status =
                            resume.processing_status?.toLowerCase();

                        return (
                            <Link
                                key={resume.id}
                                href={`/resumes/${resume.id}`}
                                className="flex items-center justify-between rounded-2xl border border-border-subtle p-4 hover:bg-paper-soft transition"
                            >

                                {/* Resume information */}

                                <div className="flex items-center gap-3 min-w-0">

                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-brand/10 flex items-center justify-center">
                                        <FileText
                                            size={18}
                                            className="text-brand"
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <div className="font-semibold text-ink truncate">
                                            {resume.original_filename}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">

                                            <span>
                                                Resume #{resume.id}
                                            </span>

                                            {status === "completed" && (
                                                <>
                                                    <span>•</span>

                                                    <span className="flex items-center gap-1 text-emerald-600">
                                                        <CheckCircle2 size={12} />
                                                        Analyzed
                                                    </span>
                                                </>
                                            )}

                                            {(status === "pending" ||
                                                status === "processing") && (
                                                    <>
                                                        <span>•</span>

                                                        <span className="flex items-center gap-1 text-amber-600">
                                                            <Clock size={12} />
                                                            Processing
                                                        </span>
                                                    </>
                                                )}

                                            {status === "failed" && (
                                                <>
                                                    <span>•</span>

                                                    <span className="flex items-center gap-1 text-red-600">
                                                        <AlertCircle size={12} />
                                                        Failed
                                                    </span>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}

                                <div className="flex items-center gap-2 shrink-0">

                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            handleDeleteClick(
                                                e,
                                                resume
                                            )
                                        }
                                        className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-red-600 hover:bg-red-50 transition"
                                        aria-label={`Delete ${resume.original_filename}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <ArrowRight
                                        size={17}
                                        className="text-ink-muted"
                                    />

                                </div>
                            </Link>
                        );
                    })}

                </div>
            )}
        </div>
    );
} 