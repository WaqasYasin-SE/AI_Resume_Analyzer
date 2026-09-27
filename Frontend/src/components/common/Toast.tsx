"use client";

import { useToast } from "@/context/ToastContext";

import "./Toast.css";

function Toast() {
    const {
        toast,
        hideToast,
    } = useToast();

    if (!toast) {
        return null;
    }

    return (
        <div
            className={`toast toast--${toast.type}`}
            role="alert"
        >
            <div className="toast__content">
                <span className="toast__icon">
                    {toast.type === "success" && "✓"}
                    {toast.type === "error" && "!"}
                    {toast.type === "warning" && "⚠"}
                    {toast.type === "info" && "i"}
                </span>

                <p className="toast__message">
                    {toast.message}
                </p>
            </div>

            <button
                type="button"
                className="toast__close"
                onClick={hideToast}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
}

export default Toast;