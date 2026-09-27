
"use client";

import { AlertTriangle, X } from "lucide-react";

type DeleteResumeModalProps = {
    open: boolean;
    resumeName?: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteResumeModal({
    open,
    resumeName,
    loading = false,
    onClose,
    onConfirm,
}: DeleteResumeModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-resume-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
                onClick={loading ? undefined : onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-3xl bg-white border border-border-subtle shadow-2xl p-6 md:p-7">
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="absolute right-4 top-4 h-9 w-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-paper-soft hover:text-ink transition disabled:opacity-50"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                    <AlertTriangle
                        size={24}
                        className="text-red-600"
                    />
                </div>

                {/* Content */}
                <h2
                    id="delete-resume-title"
                    className="font-display text-2xl font-extrabold text-ink tracking-tight"
                >
                    Delete resume?
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    Are you sure you want to permanently delete{" "}
                    {resumeName ? (
                        <span className="font-semibold text-ink">
                            "{resumeName}"
                        </span>
                    ) : (
                        "this resume"
                    )}
                    ?
                </p>

                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    This will also remove its analysis and cannot be undone.
                </p>

                {/* Actions */}
                <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-auto rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-bold text-ink hover:bg-paper-soft transition disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition disabled:opacity-60"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Resume"}
                    </button>
                </div>
            </div>
        </div>
    );
}

