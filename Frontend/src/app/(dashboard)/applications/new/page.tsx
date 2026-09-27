"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Briefcase,
} from "lucide-react";

import {
    getJobs,
    type Job,
} from "@/services/api/jobApi";

import {
    createApplication,
    type ApplicationCreate,
} from "@/services/api/applicationApi";

import { useToast } from "@/context/ToastContext";

export default function NewApplicationPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    const [form, setForm] =
        useState<ApplicationCreate>({
            job_id: 0,
            status: "applied",
            applied_at: "",
            notes: "",
        });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadJobs() {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error(
                    "Failed to load jobs:",
                    error
                );

                setError(
                    "Unable to load your jobs."
                );
            } finally {
                setLoadingJobs(false);
            }
        }

        loadJobs();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]:
                name === "job_id"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!form.job_id) {
            setError("Please select a job.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createApplication({
                job_id: form.job_id,
                status: form.status,
                applied_at: form.applied_at
                    ? new Date(
                        form.applied_at
                    ).toISOString()
                    : undefined,
                notes: form.notes || undefined,
            });

            showToast(
                "Application created successfully.",
                "success"
            );

            router.push("/applications");
        } catch (error: any) {
            console.error(
                "Failed to create application:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail
                    ? JSON.stringify(
                        error.response.data.detail
                    )
                    : "Unable to create application. Please try again."
            );

            showToast(
                "Unable to create application. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-paper-soft">
            <div className="mx-auto max-w-3xl px-6 md:px-10 py-10 md:py-14">

                <Link
                    href="/applications"
                    className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-brand transition"
                >
                    <ArrowLeft size={15} />
                    Back to applications
                </Link>

                <div className="mt-6 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
                        <Briefcase
                            size={22}
                            className="text-brand"
                        />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                        Job Tracker
                    </p>

                    <h1 className="font-display text-3xl md:text-4xl font-black text-ink mt-1">
                        Add Application
                    </h1>

                    <p className="text-sm text-ink-muted mt-2">
                        Track a job that you have applied for.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl bg-white border border-border-subtle shadow-sm p-6 md:p-8"
                >
                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium p-4 mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">

                        <div>
                            <label
                                htmlFor="job_id"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Job
                            </label>

                            {loadingJobs ? (
                                <div className="rounded-xl border border-border-subtle px-4 py-3 text-sm text-ink-muted">
                                    Loading jobs...
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="rounded-xl border border-border-subtle p-4">
                                    <p className="text-sm text-ink-muted">
                                        You don't have any saved jobs yet.
                                    </p>

                                    <Link
                                        href="/jobs/new"
                                        className="inline-block mt-3 text-sm font-bold text-brand hover:underline"
                                    >
                                        Add a job first →
                                    </Link>
                                </div>
                            ) : (
                                <select
                                    id="job_id"
                                    name="job_id"
                                    value={
                                        form.job_id || ""
                                    }
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none bg-white focus:border-brand focus:ring-2 focus:ring-brand/10"
                                >
                                    <option value="">
                                        Select a job
                                    </option>

                                    {jobs.map((job) => (
                                        <option
                                            key={job.id}
                                            value={job.id}
                                        >
                                            {job.job_title} —{" "}
                                            {job.company_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Application Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none bg-white focus:border-brand focus:ring-2 focus:ring-brand/10"
                            >
                                <option value="APPLIED">
                                    Applied
                                </option>

                                <option value="SCREENING">
                                    Screening
                                </option>

                                <option value="INTERVIEW">
                                    Interview
                                </option>

                                <option value="OFFER">
                                    Offer
                                </option>

                                <option value="REJECTED">
                                    Rejected
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="applied_at"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Applied Date
                            </label>

                            <input
                                id="applied_at"
                                name="applied_at"
                                type="datetime-local"
                                value={
                                    form.applied_at || ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Notes
                            </label>

                            <textarea
                                id="notes"
                                name="notes"
                                value={
                                    form.notes || ""
                                }
                                onChange={handleChange}
                                rows={5}
                                placeholder="Add notes about this application..."
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none resize-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border-subtle">

                        <Link
                            href="/applications"
                            className="rounded-xl px-5 py-3 text-sm font-bold text-ink-muted hover:bg-paper-soft transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                loadingJobs ||
                                jobs.length === 0
                            }
                            className="rounded-xl bg-brand text-white px-5 py-3 text-sm font-bold hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Application"}
                        </button>

                    </div>
                </form>
            </div>
        </main>
    );
}