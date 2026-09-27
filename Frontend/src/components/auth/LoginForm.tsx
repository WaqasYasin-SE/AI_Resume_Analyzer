import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import "./LoginForm.css";


/* ── Inline SVG icons (no extra dependency needed) ─────────── */
const IconEmail = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const IconLock = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconEye = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

const IconAlertCircle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);


function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPwd, setShowPwd] = useState(false);


    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }


    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(formData);
            showToast("Login successful.", "success");
            navigate("/dashboard", { replace: true });

        } catch (err) {
            const message =
                err.response?.data?.detail || "Unable to login.";
            setError(message);
            showToast(message, "error");

        } finally {
            setSubmitting(false);
        }
    }


    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* ── Email ─────────────────────────────────────── */}
            <div className="auth-form__field">
                <label htmlFor="email">Email address</label>

                <div className="auth-form__input-wrapper">
                    <span className="auth-form__input-icon">
                        <IconEmail />
                    </span>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </div>
            </div>


            {/* ── Password ──────────────────────────────────── */}
            <div className="auth-form__field">
                <label htmlFor="password">Password</label>

                <div className="auth-form__input-wrapper">
                    <span className="auth-form__input-icon">
                        <IconLock />
                    </span>

                    <input
                        id="password"
                        name="password"
                        type={showPwd ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="button"
                        className="auth-form__password-toggle"
                        onClick={() => setShowPwd((v) => !v)}
                        aria-label={showPwd ? "Hide password" : "Show password"}
                        tabIndex={-1}
                    >
                        {showPwd ? <IconEyeOff /> : <IconEye />}
                    </button>
                </div>
            </div>


            {/* ── Forgot password ───────────────────────────── */}
            <div className="auth-form__forgot">
                <Link to="/forgot-password">Forgot password?</Link>
            </div>


            {/* ── Error message ─────────────────────────────── */}
            {error && (
                <p className="auth-form__error" role="alert">
                    <span className="auth-form__error-icon">
                        <IconAlertCircle />
                    </span>
                    {error}
                </p>
            )}


            {/* ── Submit ────────────────────────────────────── */}
            <button
                className="auth-form__submit"
                type="submit"
                disabled={submitting}
            >
                <span className="auth-form__btn-inner">
                    {submitting && (
                        <span className="auth-form__spinner" aria-hidden="true" />
                    )}
                    {submitting ? "Signing in…" : "Sign in"}
                </span>
            </button>


            {/* ── Divider ───────────────────────────────────── */}
            <div className="auth-form__divider">or</div>


            {/* ── Footer ───────────────────────────────────── */}
            <p className="auth-form__footer">
                Don't have an account?{" "}
                <Link to="/register">Create account</Link>
            </p>
        </form>
    );
}

export default LoginForm;