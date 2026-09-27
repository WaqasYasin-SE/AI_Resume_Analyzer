"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";

type ResumeUploadModalProps = {
    open: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
};

export default function ResumeUploadModal({
    open,
    onClose,
    onUpload,
}: ResumeUploadModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    if (!open) {
        return null;
    }

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        setError("");

        if (!selectedFile) {
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Resume must be smaller than 5 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF resume.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            await onUpload(file);

            setFile(null);
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-display text-2xl font-extrabold text-ink">
                            Upload Resume
                        </h2>

                        <p className="text-sm text-ink-muted mt-1">
                            Upload your PDF and start AI analysis.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={uploading}
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-ink-muted hover:bg-paper-soft"
                    >
                        <X size={18} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border-subtle rounded-2xl p-8 hover:border-brand/40 hover:bg-brand/[0.02] transition"
                >
                    {file ? (
                        <div className="flex items-center justify-center gap-3">
                            <FileText
                                size={28}
                                className="text-brand"
                            />

                            <div className="text-left">
                                <div className="font-semibold text-ink">
                                    {file.name}
                                </div>

                                <div className="text-xs text-ink-muted">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload
                                size={30}
                                className="mx-auto text-brand mb-3"
                            />

                            <div className="font-semibold text-ink">
                                Choose your resume
                            </div>

                            <div className="text-xs text-ink-muted mt-1">
                                PDF only · Maximum 5 MB
                            </div>
                        </>
                    )}
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {error && (
                    <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full mt-5 rounded-xl bg-brand text-white py-3.5 text-sm font-bold hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading
                        ? "Uploading..."
                        : "Upload & Analyze"}
                </button>
            </div>
        </div>
    );
}