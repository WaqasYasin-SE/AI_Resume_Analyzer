import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getResume,
    getResumeAnalysis,
} from "../../services/api/resumeApi";

import ResumeStatus from "../../components/resume/ResumeStatus";
import ScoreCard from "../../components/analysis/ScoreCard";
import SummaryCard from "../../components/analysis/SummaryCard";
import StrengthsList from "../../components/analysis/StrengthsList";
import IssuesList from "../../components/analysis/IssuesList";
import RecommendationsList from "../../components/analysis/RecommendationsList";

import "./ResumeDetailsPage.css";

function ResumeDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] =
        useState(false);
    const [error, setError] = useState("");

    const loadResume = useCallback(async () => {
        try {
            const data = await getResume(id);

            setResume(data);
            setError("");

            return data;
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Unable to load resume."
            );

            return null;
        }
    }, [id]);

    const loadAnalysis = useCallback(async () => {
        setAnalysisLoading(true);

        try {
            const data = await getResumeAnalysis(id);

            setAnalysis(data);
        } catch {
            setAnalysis(null);
        } finally {
            setAnalysisLoading(false);
        }
    }, [id]);

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);

            const data = await loadResume();

            const status =
                data?.processing_status?.toLowerCase();

            if (status === "completed") {
                await loadAnalysis();
            }

            setLoading(false);
        }

        loadInitialData();
    }, [loadResume, loadAnalysis]);

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

        const interval = setInterval(async () => {
            const updatedResume =
                await loadResume();

            const updatedStatus =
                updatedResume?.processing_status?.toLowerCase();

            if (updatedStatus === "completed") {
                await loadAnalysis();
                clearInterval(interval);
            }

            if (updatedStatus === "failed") {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [
        resume,
        loadResume,
        loadAnalysis,
    ]);

    if (loading) {
        return (
            <div className="resume-details-page__state">
                <p>Loading resume...</p>
            </div>
        );
    }

    if (!resume || error) {
        return (
            <div className="resume-details-page__state">
                <h1>Resume unavailable</h1>

                <p>
                    {error || "Resume not found."}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Back to dashboard
                </button>
            </div>
        );
    }

    const status =
        resume.processing_status?.toLowerCase();

    return (
        <div className="resume-details-page">
            <header className="resume-details-page__header">
                <div>
                    <button
                        type="button"
                        className="resume-details-page__back"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back
                    </button>

                    <p className="resume-details-page__eyebrow">
                        Resume Analysis
                    </p>

                    <h1>
                        {resume.original_filename}
                    </h1>

                    <p>
                        AI-powered analysis of your resume.
                    </p>
                </div>

                <ResumeStatus
                    status={resume.processing_status}
                />
            </header>

            {status === "pending" && (
                <section className="resume-details-page__message">
                    <h2>Resume queued</h2>
                    <p>
                        Your resume has been uploaded and
                        is waiting to be processed.
                    </p>
                </section>
            )}

            {status === "processing" && (
                <section className="resume-details-page__message">
                    <h2>Analyzing your resume</h2>
                    <p>
                        AI is reviewing your resume.
                        This page updates automatically.
                    </p>
                </section>
            )}

            {status === "failed" && (
                <section className="resume-details-page__message resume-details-page__message--error">
                    <h2>Analysis failed</h2>

                    <p>
                        {resume.processing_error ||
                            "Unable to complete the analysis."}
                    </p>
                </section>
            )}

            {status === "completed" &&
                analysis && (
                    <div className="resume-details-page__content">
                        <ScoreCard
                            score={analysis.score}
                        />

                        <SummaryCard
                            summary={analysis.summary}
                        />

                        <div className="resume-details-page__grid">
                            <StrengthsList
                                strengths={
                                    analysis.strengths
                                }
                            />

                            <IssuesList
                                weaknesses={
                                    analysis.weaknesses
                                }
                            />
                        </div>

                        <RecommendationsList
                            recommendations={
                                analysis.recommendations
                            }
                        />
                    </div>
                )}

            {status === "completed" &&
                analysisLoading && (
                    <section className="resume-details-page__message">
                        <p>
                            Loading AI analysis...
                        </p>
                    </section>
                )}
        </div>
    );
}

export default ResumeDetailsPage;