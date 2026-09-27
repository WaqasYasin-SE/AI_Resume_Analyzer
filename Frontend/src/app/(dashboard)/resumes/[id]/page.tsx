"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Sparkles,
    Check,
    ChevronRight,
    Clock,
    AlertCircle,
} from "lucide-react";

import {
    getResume,
    getResumeAnalysis,
} from "@/services/api/resumeApi";

import "./ResumeDetailsPage.css";

type ResumeWithStatus = {
    id: number;
    original_filename: string;
    processing_status?: string;
    processing_error?: string | null;
};

type ResumeAnalysis = {
    score: number;
    summary: string;
    strengths: string[];
    recommendations: string[];
};

/* =========================================================
   STATUS
========================================================= */

function ResumeStatus({
    status,
}: {
    status?: string;
}) {
    const normalizedStatus = status?.toLowerCase();

    const statusConfig: Record<
        string,
        {
            label: string;
            className: string;
        }
    > = {
        pending: {
            label: "Pending",
            className: "status--pending",
        },

        processing: {
            label: "Processing",
            className: "status--processing",
        },

        completed: {
            label: "Analysis Complete",
            className: "status--completed",
        },

        failed: {
            label: "Processing Failed",
            className: "status--failed",
        },
    };

    const current =
        statusConfig[normalizedStatus || ""] || {
            label: "Unknown",
            className: "status--unknown",
        };

    return (
        <span
            className={`resume-status ${current.className}`}
        >
            <span className="resume-status__dot" />

            {current.label}
        </span>
    );
}

/* =========================================================
   SCORE CARD
========================================================= */

function ScoreCard({
    score,
}: {
    score: number;
}) {
    const safeScore = Math.min(
        Math.max(score || 0, 0),
        100
    );

    return (
        <section className="analysis-card score-card">

            <div className="score-card__header">

                <div>
                    <p className="card-eyebrow">
                        Overall Score
                    </p>

                    <h2 className="card-title">
                        Resume Score
                    </h2>
                </div>

                <span className="score-card__badge">
                    <Sparkles size={13} />
                    AI Analysis
                </span>

            </div>

            <div className="score-card__score">

                <span>{safeScore}</span>

                <small>/ 100</small>

            </div>

            <div className="score-card__progress">

                <div
                    className="score-card__progress-fill"
                    style={{
                        width: `${safeScore}%`,
                    }}
                />

            </div>

            <p className="score-card__description">

                {safeScore >= 85
                    ? "Excellent resume. You are in a strong position."
                    : safeScore >= 75
                        ? "Good resume with some opportunities to improve."
                        : safeScore >= 60
                            ? "Your resume has a solid foundation but needs improvement."
                            : "Your resume needs attention before applying."}

            </p>

        </section>
    );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
    summary,
}: {
    summary: string;
}) {
    return (
        <section className="analysis-card">

            <p className="card-eyebrow">
                Overview
            </p>

            <h2 className="card-title">
                Resume Summary
            </h2>

            <p className="summary-text">
                {summary}
            </p>

        </section>
    );
}

/* =========================================================
   LIST CARD
========================================================= */

function ListCard({
    title,
    eyebrow,
    items,
    type,
}: {
    title: string;
    eyebrow: string;
    items?: string[];
    type: "strengths" | "recommendations";
}) {
    return (
        <section className="analysis-card list-card">

            <div className="list-card__header">

                <div>

                    <p className="card-eyebrow">
                        {eyebrow}
                    </p>

                    <h2 className="card-title">
                        {title}
                    </h2>

                </div>

                <span
                    className={`list-card__icon list-card__icon--${type}`}
                >
                    {type === "strengths" ? (
                        <Check
                            size={16}
                            strokeWidth={3}
                        />
                    ) : (
                        <ChevronRight
                            size={16}
                            strokeWidth={3}
                        />
                    )}
                </span>

            </div>

            {!items || items.length === 0 ? (

                <p className="empty-text">
                    No information available.
                </p>

            ) : (

                <div className="list-card__items">

                    {items.map((item, index) => (

                        <div
                            key={`${item}-${index}`}
                            className="list-card__item"
                        >

                            <span
                                className={`list-card__item-marker list-card__item-marker--${type}`}
                            >
                                {type === "strengths" ? (
                                    <Check
                                        size={13}
                                        strokeWidth={3}
                                    />
                                ) : (
                                    index + 1
                                )}
                            </span>

                            <p>{item}</p>

                        </div>

                    ))}

                </div>

            )}

        </section>
    );
}

/* =========================================================
   PAGE
========================================================= */

export default function ResumeDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const resumeId = Number(params.id);

    const [resume, setResume] =
        useState<ResumeWithStatus | null>(null);

    const [analysis, setAnalysis] =
        useState<ResumeAnalysis | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [analysisLoading, setAnalysisLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    /* =======================================================
       LOAD RESUME
    ======================================================= */

    const loadResume = useCallback(async () => {
        try {
            const data =
                await getResume(resumeId);

            setResume(
                data as ResumeWithStatus
            );

            setError("");

            return data as ResumeWithStatus;
        } catch (error: unknown) {
            console.error(
                "Failed to load resume:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to load resume.";

            setError(message);

            return null;
        }
    }, [resumeId]);

    /* =======================================================
       LOAD ANALYSIS
    ======================================================= */

    const loadAnalysis = useCallback(async () => {
        try {
            setAnalysisLoading(true);

            const data =
                await getResumeAnalysis(
                    resumeId
                );

            setAnalysis(data);
        } catch (error) {
            console.error(
                "Failed to load analysis:",
                error
            );

            setAnalysis(null);
        } finally {
            setAnalysisLoading(false);
        }
    }, [resumeId]);

    /* =======================================================
       INITIAL LOAD
    ======================================================= */

    useEffect(() => {
        if (
            !resumeId ||
            Number.isNaN(resumeId)
        ) {
            setError("Invalid resume ID.");
            setLoading(false);

            return;
        }

        async function loadInitialData() {
            setLoading(true);

            const data =
                await loadResume();

            const status =
                data?.processing_status?.toLowerCase();

            if (status === "completed") {
                await loadAnalysis();
            }

            setLoading(false);
        }

        loadInitialData();
    }, [
        resumeId,
        loadResume,
        loadAnalysis,
    ]);

    /* =======================================================
       POLLING
    ======================================================= */

    useEffect(() => {
        if (!resume) {
            return;
        }

        const status =
            resume.processing_status?.toLowerCase();

        if (
            status !== "pending" &&
            status !== "processing"
        ) {
            return;
        }

        const interval = setInterval(
            async () => {
                const updatedResume =
                    await loadResume();

                const updatedStatus =
                    updatedResume?.processing_status?.toLowerCase();

                if (
                    updatedStatus ===
                    "completed"
                ) {
                    await loadAnalysis();

                    clearInterval(interval);
                }

                if (
                    updatedStatus === "failed"
                ) {
                    clearInterval(interval);
                }
            },
            3000
        );

        return () =>
            clearInterval(interval);
    }, [
        resume,
        loadResume,
        loadAnalysis,
    ]);

    /* =======================================================
       LOADING
    ======================================================= */

    if (loading) {
        return (
            <main className="resume-details-page">

                <div className="resume-details-state">

                    <div className="loading-spinner" />

                    <p>
                        Loading resume...
                    </p>

                </div>

            </main>
        );
    }

    /* =======================================================
       ERROR
    ======================================================= */

    if (!resume || error) {
        return (
            <main className="resume-details-page">

                <div className="resume-details-state">

                    <div className="state-icon state-icon--error">
                        <AlertCircle size={28} />
                    </div>

                    <h1>
                        Resume unavailable
                    </h1>

                    <p>
                        {error ||
                            "Resume not found."}
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            router.push(
                                "/dashboard"
                            )
                        }
                    >
                        Back to dashboard
                    </button>

                </div>

            </main>
        );
    }

    const status =
        resume.processing_status?.toLowerCase();

    /* =======================================================
       PAGE UI
    ======================================================= */

    return (
        <main className="resume-details-page">

            <div className="resume-details-container">

                {/* HEADER */}

                <header className="resume-details-header">

                    <div>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() =>
                                router.push(
                                    "/dashboard"
                                )
                            }
                        >
                            <ArrowLeft size={16} />

                            Back to dashboard
                        </button>

                        <p className="header-eyebrow">
                            Resume Analysis
                        </p>

                        <h1>
                            {resume.original_filename}
                        </h1>

                        <p className="header-description">
                            AI-powered analysis of
                            your resume.
                        </p>

                    </div>

                    <ResumeStatus
                        status={
                            resume.processing_status
                        }
                    />

                </header>

                {/* PENDING */}

                {status === "pending" && (
                    <section className="status-message status-message--pending">

                        <div className="status-message__icon">
                            <Clock size={20} />
                        </div>

                        <div>

                            <h2>
                                Resume queued
                            </h2>

                            <p>
                                Your resume has been
                                uploaded and is waiting
                                to be processed.
                            </p>

                        </div>

                    </section>
                )}

                {/* PROCESSING */}

                {status === "processing" && (
                    <section className="status-message status-message--processing">

                        <div className="status-message__icon">
                            <Sparkles size={20} />
                        </div>

                        <div className="status-message__content">

                            <h2>
                                Analyzing your resume
                            </h2>

                            <p>
                                AI is reviewing your
                                resume. This page will
                                update automatically.
                            </p>

                            <div className="processing-bar">

                                <div className="processing-bar__fill" />

                            </div>

                        </div>

                    </section>
                )}

                {/* FAILED */}

                {status === "failed" && (
                    <section className="status-message status-message--failed">

                        <div className="status-message__icon">
                            <AlertCircle size={20} />
                        </div>

                        <div>

                            <h2>
                                Analysis failed
                            </h2>

                            <p>
                                {resume.processing_error ||
                                    "Unable to complete the analysis."}
                            </p>

                        </div>

                    </section>
                )}

                {/* ANALYSIS */}

                {status === "completed" &&
                    analysis && (
                        <div className="analysis-content">

                            <ScoreCard
                                score={analysis.score}
                            />

                            <SummaryCard
                                summary={analysis.summary}
                            />

                            <div className="analysis-grid">

                                <ListCard
                                    title="Strengths"
                                    eyebrow="What's working"
                                    items={
                                        analysis.strengths
                                    }
                                    type="strengths"
                                />

                                <ListCard
                                    title="Recommendations"
                                    eyebrow="What to improve"
                                    items={
                                        analysis.recommendations
                                    }
                                    type="recommendations"
                                />

                            </div>

                        </div>
                    )}

                {/* ANALYSIS LOADING */}

                {status === "completed" &&
                    analysisLoading && (
                        <section className="status-message status-message--processing">

                            <div className="status-message__icon">
                                <Sparkles size={20} />
                            </div>

                            <div>

                                <h2>
                                    Loading AI analysis...
                                </h2>

                                <p>
                                    Please wait while we
                                    retrieve your analysis.
                                </p>

                            </div>

                        </section>
                    )}

                {/* NO ANALYSIS */}

                {status === "completed" &&
                    !analysis &&
                    !analysisLoading && (
                        <section className="status-message status-message--failed">

                            <div className="status-message__icon">
                                <AlertCircle size={20} />
                            </div>

                            <div>

                                <h2>
                                    Analysis not available
                                </h2>

                                <p>
                                    The resume was
                                    processed, but its
                                    analysis could not be
                                    loaded.
                                </p>

                                <button
                                    type="button"
                                    className="primary-button primary-button--small"
                                    onClick={loadAnalysis}
                                >
                                    Try Again
                                </button>

                            </div>

                        </section>
                    )}

            </div>

        </main>
    );
}