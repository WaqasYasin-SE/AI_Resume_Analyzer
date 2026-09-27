"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Upload, X } from "lucide-react";

import { uploadResume } from "@/services/api/resumeApi";

export default function UploadResumePage() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const validateFile = (selectedFile: File) => {
        if (selectedFile.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            return false;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5 MB.");
            return false;
        }

        setError("");
        return true;
    };

    const handleFile = (selectedFile: File) => {
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        }
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            handleFile(selectedFile);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);

        const droppedFile = event.dataTransfer.files?.[0];

        if (droppedFile) {
            handleFile(droppedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF resume first.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const resume = await uploadResume(file);

            router.push(`/resumes/${resume.id}`);
        } catch (error: any) {
            console.error("Resume upload failed:", error);

            setError(
                error?.response?.data?.detail ||
                "Unable to upload resume. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <main className="min-h-screen bg-paper-soft">
            {/* Header */}
            <header className="border-b border-border-subtle bg-white">
                <div className="mx-auto max-w-5xl px-6 md:px-10 h-16 flex items-center">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
                <div className="text-center mb-10">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                        <FileText
                            size={28}
                            className="text-brand"
                        />
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
                        Upload your resume
                    </h1>

                    <p className="mt-3 text-ink-muted">
                        Upload your PDF resume and let AI analyze it for
                        strengths, weaknesses, ATS compatibility, and
                        improvement opportunities.
                    </p>
                </div>

                {/* Upload Box */}
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition ${dragging
                            ? "border-brand bg-brand/5"
                            : "border-border-subtle bg-white"
                        }`}
                >
                    {!file ? (
                        <>
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-paper-soft">
                                <Upload
                                    size={26}
                                    className="text-brand"
                                />
                            </div>

                            <h2 className="font-display text-xl font-extrabold text-ink">
                                Drop your resume here
                            </h2>

                            <p className="mt-2 text-sm text-ink-muted">
                                or choose a PDF file from your computer
                            </p>

                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark transition"
                            >
                                Choose PDF
                                <Upload size={16} />
                            </button>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handleInputChange}
                                className="hidden"
                            />

                            <p className="mt-5 text-xs text-ink-muted">
                                PDF only · Maximum 5 MB
                            </p>
                        </>
                    ) : (
                        <div>
                            <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-border-subtle bg-paper-soft p-4 text-left">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                                        <FileText
                                            size={20}
                                            className="text-brand"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-ink">
                                            {file.name}
                                        </p>

                                        <p className="mt-1 text-xs text-ink-muted">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={removeFile}
                                    disabled={uploading}
                                    className="ml-3 rounded-lg p-2 text-ink-muted hover:bg-white hover:text-ink transition disabled:opacity-50"
                                    aria-label="Remove file"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark transition disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploading ? (
                                    "Uploading..."
                                ) : (
                                    <>
                                        Analyze Resume
                                        <Upload size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {/* Info */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border-subtle bg-white p-5">
                        <p className="font-bold text-ink">
                            ATS Check
                        </p>

                        <p className="mt-1 text-sm text-ink-muted">
                            Check how well your resume works with ATS systems.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border-subtle bg-white p-5">
                        <p className="font-bold text-ink">
                            AI Feedback
                        </p>

                        <p className="mt-1 text-sm text-ink-muted">
                            Discover strengths, weaknesses, and missing information.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border-subtle bg-white p-5">
                        <p className="font-bold text-ink">
                            Actionable Tips
                        </p>

                        <p className="mt-1 text-sm text-ink-muted">
                            Get recommendations to improve your resume.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}