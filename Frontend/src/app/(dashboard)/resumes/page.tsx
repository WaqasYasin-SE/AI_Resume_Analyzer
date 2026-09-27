"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Trash2,
} from "lucide-react";

import {
    getResumes,
    deleteResume,
} from "@/services/api/resumeApi";

import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

type Resume = {
    id: number;
    original_filename: string;
    processing_status?: string;
    processing_error?: string | null;
};

export default function ResumesPage() {
    const { showToast } = useToast();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] =
        useState<number | null>(null);

    useEffect(() => {
        async function loadResumes() {
            try {
                setLoading(true);
                setError("");

                const data = await getResumes();

                setResumes(data as Resume[]);
            } catch (error: unknown) {
                console.error(
                    "Failed to load resumes:",
                    error
                );

                setError(
                    "Unable to load your resumes."
                );
            } finally {
                setLoading(false);
            }
        }

        loadResumes();
    }, []);

    async function handleDelete() {
        if (confirmDeleteId === null) {
            return;
        }

        const resumeId = confirmDeleteId;

        try {
            setDeletingId(resumeId);

            await deleteResume(resumeId);

            setResumes((current) =>
                current.filter(
                    (resume) =>
                        resume.id !== resumeId
                )
            );

            setConfirmDeleteId(null);

            showToast(
                "Resume deleted successfully.",
                "success"
            );
        } catch (error: unknown) {
            console.error(
                "Failed to delete resume:",
                error
            );

            showToast(
                "Unable to delete the resume. Please try again.",
                "error"
            );
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-paper-soft flex items-center justify-center">
                <p className="text-sm font-medium text-ink-muted">
                    Loading resumes...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-paper-soft flex items-center justify-center px-6">
                <div className="text-center">
                    <AlertCircle
                        size={32}
                        className="mx-auto text-red-500 mb-3"
                    />

                    <h1 className="text-xl font-bold text-ink">
                        Unable to load resumes
                    </h1>

                    <p className="text-sm text-ink-muted mt-2">
                        {error}
                    </p>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 mt-5 rounded-xl bg-brand text-white px-4 py-2.5 text-sm font-bold"
                    >
                        <ArrowLeft size={15} />
                        Back to dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-paper-soft">
            <div className="mx-auto max-w-5xl px-6 md:px-10 py-10 md:py-14">

                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-brand transition"
                    >
                        <ArrowLeft size={15} />
                        Back to dashboard
                    </Link>

                    <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                            Resume Management
                        </p>

                        <h1 className="font-display text-3xl md:text-4xl font-black text-ink mt-1">
                            All Resumes
                        </h1>

                        <p className="text-sm text-ink-muted mt-2">
                            View and manage all your uploaded resumes.
                        </p>
                    </div>
                </div>

                {resumes.length === 0 ? (
                    <div className="rounded-3xl bg-white border border-border-subtle shadow-sm p-12 text-center">
                        <FileText
                            size={36}
                            className="mx-auto text-ink-muted mb-4"
                        />

                        <h2 className="text-xl font-bold text-ink">
                            No resumes yet
                        </h2>

                        <p className="text-sm text-ink-muted mt-2">
                            Upload a resume to start your AI analysis.
                        </p>

                        <Link
                            href="/resumes/upload"
                            className="inline-flex items-center gap-2 mt-6 rounded-xl bg-brand text-white px-5 py-3 text-sm font-bold hover:bg-brand-dark transition"
                        >
                            Upload Resume
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-3xl bg-white border border-border-subtle shadow-sm p-6 md:p-8">

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-display text-xl font-extrabold text-ink">
                                    Your Resumes
                                </h2>

                                <p className="text-sm text-ink-muted mt-1">
                                    {resumes.length} resume
                                    {resumes.length !== 1
                                        ? "s"
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {resumes.map((resume) => {
                                const status =
                                    resume.processing_status?.toLowerCase();

                                const isDeleting =
                                    deletingId === resume.id;

                                return (
                                    <div
                                        key={resume.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle p-4 hover:bg-paper-soft transition"
                                    >
                                        <Link
                                            href={`/resumes/${resume.id}`}
                                            className="flex min-w-0 flex-1 items-center gap-3"
                                        >
                                            <div className="h-11 w-11 shrink-0 rounded-xl bg-brand/10 flex items-center justify-center">
                                                <FileText
                                                    size={19}
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

                                            <ArrowRight
                                                size={18}
                                                className="ml-auto shrink-0 text-ink-muted"
                                            />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmDeleteId(
                                                    resume.id
                                                )
                                            }
                                            disabled={isDeleting}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-label="Delete resume"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <ConfirmModal
                    open={
                        confirmDeleteId !== null
                    }
                    title="Are you sure you want to delete this resume?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    loading={
                        deletingId !== null
                    }
                    onConfirm={handleDelete}
                    onCancel={() => {
                        if (
                            deletingId === null
                        ) {
                            setConfirmDeleteId(
                                null
                            );
                        }
                    }}
                />
            </div>
        </main>
    );
}