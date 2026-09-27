"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Briefcase,
} from "lucide-react";

import {
    createJob,
    type JobCreate,
} from "@/services/api/jobApi";

import { useToast } from "@/context/ToastContext";

export default function NewJobPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [form, setForm] = useState<JobCreate>({
        company_name: "",
        job_title: "",
        description: "",
        job_url: "",
        location: "",
        salary: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await createJob(form);

            showToast(
                "Job created successfully.",
                "success"
            );

            router.push("/jobs");
        } catch (error) {
            console.error(
                "Failed to create job:",
                error
            );

            setError(
                "Unable to create job. Please try again."
            );

            showToast(
                "Unable to create job. Please try again.",
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
                    href="/jobs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-brand transition"
                >
                    <ArrowLeft size={15} />
                    Back to jobs
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
                        Add New Job
                    </h1>

                    <p className="text-sm text-ink-muted mt-2">
                        Save a job so you can track it and
                        manage your application.
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
                                htmlFor="company_name"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Company Name
                            </label>

                            <input
                                id="company_name"
                                name="company_name"
                                type="text"
                                value={form.company_name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Google"
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="job_title"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Job Title
                            </label>

                            <input
                                id="job_title"
                                name="job_title"
                                type="text"
                                value={form.job_title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Python Backend Developer"
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="location"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Lahore, Pakistan"
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="salary"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Salary
                            </label>

                            <input
                                id="salary"
                                name="salary"
                                type="text"
                                value={form.salary}
                                onChange={handleChange}
                                placeholder="e.g. 80,000 - 120,000 PKR"
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="job_url"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Job URL
                            </label>

                            <input
                                id="job_url"
                                name="job_url"
                                type="url"
                                value={form.job_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-bold text-ink mb-2"
                            >
                                Job Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Paste or write the job description..."
                                className="w-full rounded-xl border border-border-subtle px-4 py-3 text-sm outline-none resize-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border-subtle">

                        <Link
                            href="/jobs"
                            className="rounded-xl px-5 py-3 text-sm font-bold text-ink-muted hover:bg-paper-soft transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-brand text-white px-5 py-3 text-sm font-bold hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Job"}
                        </button>

                    </div>
                </form>
            </div>
        </main>
    );
}