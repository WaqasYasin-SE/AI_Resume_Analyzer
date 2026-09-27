
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "../../services/api/authApi";
import { useToast } from "../../context/ToastContext";

import "./RegisterForm.css";


const IconUser = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const IconEmail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconShield = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

const IconAlert = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);


function getStrength(password: string) {
    if (!password) return { score: 0, label: "", cls: "" };

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = [
        { label: "", cls: "" },
        { label: "Weak", cls: "weak" },
        { label: "Fair", cls: "fair" },
        { label: "Good", cls: "good" },
        { label: "Strong", cls: "strong" },
    ];

    return { score, ...map[score] };
}


function RegisterForm() {
    const router = useRouter();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const strength = getStrength(formData.password);


    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");

        if (formData.password !== formData.confirm_password) {
            const message = "Passwords do not match.";

            setError(message);
            showToast(message, "error");

            return;
        }

        setSubmitting(true);

        try {
            await registerUser({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
            });

            showToast("Account created successfully.", "success");

            router.replace("/login");

        } catch (err: any) {
            const message =
                err.response?.data?.detail ||
                "Unable to create account.";

            setError(message);
            showToast(message, "error");

        } finally {
            setSubmitting(false);
        }
    }


    return (
        <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate
        >

            <div className="register-form__field">
                <label htmlFor="full_name">Full name</label>

                <div className="register-form__input-wrapper">
                    <span className="register-form__input-icon">
                        <IconUser />
                    </span>

                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        required
                    />
                </div>
            </div>


            <div className="register-form__field">
                <label htmlFor="email">Email address</label>

                <div className="register-form__input-wrapper">
                    <span className="register-form__input-icon">
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


            <div className="register-form__field">
                <label htmlFor="password">Password</label>

                <div className="register-form__input-wrapper">
                    <span className="register-form__input-icon">
                        <IconLock />
                    </span>

                    <input
                        id="password"
                        name="password"
                        type={showPwd ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                    />

                    <button
                        type="button"
                        className="register-form__password-toggle"
                        onClick={() => setShowPwd((v) => !v)}
                        aria-label={
                            showPwd
                                ? "Hide password"
                                : "Show password"
                        }
                        tabIndex={-1}
                    >
                        {showPwd ? <IconEyeOff /> : <IconEye />}
                    </button>
                </div>


                {formData.password && (
                    <div className="register-form__strength">
                        <div className="register-form__strength-bars">
                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={`register-form__strength-bar${strength.score >= bar
                                        ? ` active-${strength.cls}`
                                        : ""
                                        }`}
                                />
                            ))}
                        </div>

                        <span
                            className={`register-form__strength-label ${strength.cls}`}
                        >
                            {strength.label}
                        </span>
                    </div>
                )}
            </div>


            <div className="register-form__field">
                <label htmlFor="confirm_password">
                    Confirm password
                </label>

                <div className="register-form__input-wrapper">
                    <span className="register-form__input-icon">
                        <IconShield />
                    </span>

                    <input
                        id="confirm_password"
                        name="confirm_password"
                        type={showConfirm ? "text" : "password"}
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        required
                    />

                    <button
                        type="button"
                        className="register-form__password-toggle"
                        onClick={() =>
                            setShowConfirm((v) => !v)
                        }
                        aria-label={
                            showConfirm
                                ? "Hide password"
                                : "Show password"
                        }
                        tabIndex={-1}
                    >
                        {showConfirm ? (
                            <IconEyeOff />
                        ) : (
                            <IconEye />
                        )}
                    </button>
                </div>
            </div>


            {error && (
                <p
                    className="register-form__error"
                    role="alert"
                >
                    <span className="register-form__error-icon">
                        <IconAlert />
                    </span>

                    {error}
                </p>
            )}


            <button
                className="register-form__submit"
                type="submit"
                disabled={submitting}
            >
                <span className="register-form__btn-inner">
                    {submitting && (
                        <span
                            className="register-form__spinner"
                            aria-hidden="true"
                        />
                    )}

                    {submitting
                        ? "Creating account…"
                        : "Create account"}
                </span>
            </button>


            <div
                className="register-form__divider"
                aria-hidden="true"
            >
                or
            </div>


            <p className="register-form__footer">
                Already have an account?{" "}
                <Link href="/login">Sign in</Link>
            </p>

        </form>
    );
}

export default RegisterForm;