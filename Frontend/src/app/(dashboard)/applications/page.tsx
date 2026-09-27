"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Briefcase,
    AlertCircle,
    Trash2,
} from "lucide-react";

import {
    getApplications,
    deleteApplication,
    type Application,
} from "@/services/api/applicationApi";

import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function ApplicationsPage() {
    const { showToast } = useToast();

    const [applications, setApplications] =
        useState<Application[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] =
        useState<number | null>(null);

    useEffect(() => {
        let mounted = true;

        async function loadApplications() {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getApplications();

                if (mounted) {
                    setApplications(data);
                }
            } catch (error: unknown) {
                console.error(
                    "Failed to load applications:",
                    error
                );

                if (mounted) {
                    setError(
                        "Unable to load your applications. Please try again."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadApplications();

        return () => {
            mounted = false;
        };
    }, []);

    const handleDelete = async () => {
        if (confirmDeleteId === null) {
            return;
        }

        const applicationId =
            confirmDeleteId;

        try {
            setDeletingId(applicationId);

            await deleteApplication(
                applicationId
            );

            setApplications((current) =>
                current.filter(
                    (application) =>
                        application.id !==
                        applicationId
                )
            );

            setConfirmDeleteId(null);

            showToast(
                "Application deleted successfully.",
                "success"
            );
        } catch (error: unknown) {
            console.error(
                "Failed to delete application:",
                error
            );

            showToast(
                "Unable to delete the application. Please try again.",
                "error"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusClass = (
        status: string
    ) => {
        switch (status.toLowerCase()) {
            case "applied":
                return "bg-blue-50 text-blue-700";

            case "interview":
                return "bg-amber-50 text-amber-700";

            case "offer":
                return "bg-green-50 text-green-700";

            case "rejected":
                return "bg-red-50 text-red-700";

            case "withdrawn":
                return "bg-gray-100 text-gray-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-paper-soft">
                <p className="text-sm font-medium text-ink-muted">
                    Loading applications...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-paper-soft px-6">
                <div className="text-center">
                    <AlertCircle
                        size={32}
                        className="mx-auto mb-3 text-red-500"
                    />

                    <h1 className="text-xl font-bold text-ink">
                        Unable to load applications
                    </h1>

                    <p className="mt-2 text-sm text-ink-muted">
                        {error}
                    </p>

                    <Link
                        href="/dashboard"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
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
            <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">

                {/* Header */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition hover:text-brand"
                        >
                            <ArrowLeft size={15} />
                            Back to dashboard
                        </Link>

                        <div className="mt-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                                Job Tracker
                            </p>

                            <h1 className="mt-1 font-display text-3xl font-black text-ink md:text-4xl">
                                Applications
                            </h1>

                            <p className="mt-2 text-sm text-ink-muted">
                                Track the jobs you have applied for.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/applications/new"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
                    >
                        <Plus size={16} />
                        Add Application
                    </Link>
                </div>

                {/* Empty State */}

                {applications.length === 0 ? (
                    <div className="rounded-3xl border border-border-subtle bg-white p-12 text-center shadow-sm">
                        <Briefcase
                            size={36}
                            className="mx-auto mb-4 text-ink-muted"
                        />

                        <h2 className="text-xl font-bold text-ink">
                            No applications yet
                        </h2>

                        <p className="mt-2 text-sm text-ink-muted">
                            Start tracking the jobs you apply for.
                        </p>

                        <Link
                            href="/applications/new"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
                        >
                            <Plus size={16} />
                            Add Application
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-border-subtle bg-white p-6 shadow-sm md:p-8">

                        {/* Applications Header */}

                        <div className="mb-6">
                            <h2 className="font-display text-xl font-extrabold text-ink">
                                Your Applications
                            </h2>

                            <p className="mt-1 text-sm text-ink-muted">
                                {applications.length} application
                                {applications.length !== 1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>

                        {/* Applications List */}

                        <div className="space-y-3">
                            {applications.map(
                                (application) => {
                                    const isDeleting =
                                        deletingId ===
                                        application.id;

                                    return (
                                        <div
                                            key={
                                                application.id
                                            }
                                            className="flex items-center justify-between rounded-2xl border border-border-subtle p-4 transition hover:bg-paper-soft"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                                                    <Briefcase
                                                        size={19}
                                                        className="text-brand"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="font-semibold text-ink">
                                                        Job #
                                                        {
                                                            application.job_id
                                                        }
                                                    </div>

                                                    <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
                                                        <span>
                                                            Status:
                                                        </span>

                                                        <span
                                                            className={`rounded-full px-2.5 py-1 font-bold ${getStatusClass(
                                                                application.status
                                                            )}`}
                                                        >
                                                            {
                                                                application.status
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirmDeleteId(
                                                        application.id
                                                    )
                                                }
                                                disabled={
                                                    isDeleting
                                                }
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Delete application"
                                            >
                                                <Trash2
                                                    size={16}
                                                />
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}

                <ConfirmModal
                    open={
                        confirmDeleteId !== null
                    }
                    title="Are you sure you want to delete this application?"
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