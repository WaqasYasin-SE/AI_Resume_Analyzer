"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    MapPin,
    Plus,
    Trash2,
    Pencil,
    ExternalLink,
    AlertCircle,
} from "lucide-react";

import {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    type Job,
    type JobCreate,
} from "@/services/api/jobApi";

import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function JobsPage() {
    const { showToast } = useToast();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] =
        useState<Job | null>(null);

    const [form, setForm] = useState<JobCreate>({
        company_name: "",
        job_title: "",
        description: "",
        job_url: "",
        location: "",
        salary: "",
    });

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] =
        useState<number | null>(null);

    async function loadJobs() {
        try {
            setLoading(true);
            setError("");

            const data = await getJobs();

            setJobs(data);
        } catch (error: unknown) {
            console.error(
                "Failed to load jobs:",
                error
            );

            setError(
                "Unable to load your jobs."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadJobs();
    }, []);

    function resetForm() {
        setForm({
            company_name: "",
            job_title: "",
            description: "",
            job_url: "",
            location: "",
            salary: "",
        });

        setEditingJob(null);
        setShowForm(false);
    }

    function handleEdit(job: Job) {
        setEditingJob(job);

        setForm({
            company_name: job.company_name,
            job_title: job.job_title,
            description: job.description || "",
            job_url: job.job_url || "",
            location: job.location || "",
            salary: job.salary || "",
        });

        setShowForm(true);
    }

    function handleChange(
        field: keyof JobCreate,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        if (
            !form.company_name.trim() ||
            !form.job_title.trim()
        ) {
            return;
        }

        try {
            setSaving(true);

            if (editingJob) {
                const updatedJob =
                    await updateJob(
                        editingJob.id,
                        form
                    );

                setJobs((current) =>
                    current.map((job) =>
                        job.id === editingJob.id
                            ? updatedJob
                            : job
                    )
                );

                showToast(
                    "Job updated successfully.",
                    "success"
                );
            } else {
                const newJob =
                    await createJob(form);

                setJobs((current) => [
                    newJob,
                    ...current,
                ]);

                showToast(
                    "Job created successfully.",
                    "success"
                );
            }

            resetForm();
        } catch (error: unknown) {
            console.error(
                "Failed to save job:",
                error
            );

            showToast(
                "Unable to save job. Please try again.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (confirmDeleteId === null) {
            return;
        }

        const jobId = confirmDeleteId;

        try {
            setDeletingId(jobId);

            await deleteJob(jobId);

            setJobs((current) =>
                current.filter(
                    (job) => job.id !== jobId
                )
            );

            setConfirmDeleteId(null);

            showToast(
                "Job deleted successfully.",
                "success"
            );
        } catch (error: unknown) {
            console.error(
                "Failed to delete job:",
                error
            );

            showToast(
                "Unable to delete job. Please try again.",
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
                    Loading jobs...
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
                        Unable to load jobs
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
            <div className="mx-auto max-w-6xl px-6 md:px-10 py-10 md:py-14">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
                    <div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-brand transition"
                        >
                            <ArrowLeft size={15} />
                            Back to dashboard
                        </Link>

                        <div className="mt-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                                Career Management
                            </p>

                            <h1 className="font-display text-3xl md:text-4xl font-black text-ink mt-1">
                                Job Tracker
                            </h1>

                            <p className="text-sm text-ink-muted mt-2">
                                Save and manage the jobs you want to apply for.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setEditingJob(null);

                            setForm({
                                company_name: "",
                                job_title: "",
                                description: "",
                                job_url: "",
                                location: "",
                                salary: "",
                            });

                            setShowForm(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-white px-5 py-3 text-sm font-bold hover:bg-brand-dark transition"
                    >
                        <Plus size={16} />
                        Add Job
                    </button>
                </div>

                {showForm && (
                    <div className="rounded-3xl bg-white border border-border-subtle shadow-sm p-6 md:p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-display text-xl font-extrabold text-ink">
                                    {editingJob
                                        ? "Edit Job"
                                        : "Add New Job"}
                                </h2>

                                <p className="text-sm text-ink-muted mt-1">
                                    Add the job details below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-sm font-bold text-ink-muted hover:text-ink"
                            >
                                Cancel
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid md:grid-cols-2 gap-5"
                        >
                            <div>
                                <label className="block text-sm font-bold text-ink mb-2">
                                    Company *
                                </label>

                                <input
                                    type="text"
                                    value={form.company_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "company_name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Google"
                                    required
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-ink mb-2">
                                    Job Title *
                                </label>

                                <input
                                    type="text"
                                    value={form.job_title}
                                    onChange={(e) =>
                                        handleChange(
                                            "job_title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Python Developer"
                                    required
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-ink mb-2">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) =>
                                        handleChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Lahore / Remote"
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-ink mb-2">
                                    Salary
                                </label>

                                <input
                                    type="text"
                                    value={form.salary}
                                    onChange={(e) =>
                                        handleChange(
                                            "salary",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 80k - 120k PKR"
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-ink mb-2">
                                    Job URL
                                </label>

                                <input
                                    type="url"
                                    value={form.job_url}
                                    onChange={(e) =>
                                        handleChange(
                                            "job_url",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-ink mb-2">
                                    Description
                                </label>

                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        handleChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Job description..."
                                    rows={5}
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand resize-none"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand text-white px-6 py-3 text-sm font-bold hover:bg-brand-dark transition disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingJob
                                            ? "Update Job"
                                            : "Save Job"}

                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="rounded-3xl bg-white border border-border-subtle shadow-sm p-12 text-center">
                        <Briefcase
                            size={38}
                            className="mx-auto text-ink-muted mb-4"
                        />

                        <h2 className="text-xl font-bold text-ink">
                            No jobs saved yet
                        </h2>

                        <p className="text-sm text-ink-muted mt-2">
                            Start tracking jobs you are interested in.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setShowForm(true)
                            }
                            className="inline-flex items-center gap-2 mt-6 rounded-xl bg-brand text-white px-5 py-3 text-sm font-bold"
                        >
                            <Plus size={16} />
                            Add Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => {
                            const isDeleting =
                                deletingId === job.id;

                            return (
                                <div
                                    key={job.id}
                                    className="rounded-3xl bg-white border border-border-subtle shadow-sm p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className="h-12 w-12 shrink-0 rounded-xl bg-brand/10 flex items-center justify-center">
                                                <Briefcase
                                                    size={20}
                                                    className="text-brand"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="font-display text-lg font-extrabold text-ink">
                                                    {job.job_title}
                                                </h2>

                                                <p className="font-semibold text-ink-muted mt-1">
                                                    {job.company_name}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-ink-muted">
                                                    {job.location && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin size={13} />
                                                            {job.location}
                                                        </span>
                                                    )}

                                                    {job.salary && (
                                                        <span>
                                                            {job.salary}
                                                        </span>
                                                    )}

                                                    <span className="capitalize">
                                                        {job.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {job.job_url && (
                                                <a
                                                    href={job.job_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-10 w-10 rounded-xl border border-border-subtle flex items-center justify-center text-ink-muted hover:text-brand hover:bg-brand/5 transition"
                                                    aria-label="Open job"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(job)
                                                }
                                                className="h-10 w-10 rounded-xl border border-border-subtle flex items-center justify-center text-ink-muted hover:text-brand hover:bg-brand/5 transition"
                                                aria-label="Edit job"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirmDeleteId(
                                                        job.id
                                                    )
                                                }
                                                disabled={
                                                    isDeleting
                                                }
                                                className="h-10 w-10 rounded-xl border border-border-subtle flex items-center justify-center text-ink-muted hover:text-red-600 hover:bg-red-50 transition disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Delete job"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {job.description && (
                                        <p className="text-sm text-ink-muted leading-relaxed mt-5 pt-5 border-t border-border-subtle">
                                            {job.description}
                                        </p>
                                    )}

                                    <div className="mt-5 pt-4 border-t border-border-subtle">
                                        <Link
                                            href={`/applications?job_id=${job.id}`}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                                        >
                                            Track Application
                                            <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <ConfirmModal
                    open={
                        confirmDeleteId !== null
                    }
                    title="Are you sure you want to delete this job?"
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