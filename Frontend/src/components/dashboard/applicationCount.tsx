"use client";

type DashboardStatsProps = {
    resumeScore: number | null;
    resumeCount: number;
    completedCount: number;
    totalApplications: number;
};

export default function DashboardStats({
    resumeScore,
    resumeCount,
    completedCount,
    totalApplications,
}: DashboardStatsProps) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {/* Resume Score */}
            <div className="rounded-3xl bg-white border border-border-subtle p-6 shadow-sm">
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Resume Score
                </div>

                <div className="font-display text-4xl font-black mt-2 text-brand">
                    {resumeScore !== null ? `${resumeScore}%` : "—"}
                </div>

                <div className="text-sm font-medium text-ink-muted mt-1">
                    {resumeScore === null
                        ? "Analysis pending"
                        : resumeScore >= 85
                            ? "Excellent"
                            : resumeScore >= 75
                                ? "Good"
                                : "Needs work"}
                </div>
            </div>

            {/* Resumes */}
            <div className="rounded-3xl bg-white border border-border-subtle p-6 shadow-sm">
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Resumes
                </div>

                <div className="font-display text-4xl font-black mt-2 text-brand">
                    {resumeCount}
                </div>

                <div className="text-sm font-medium text-ink-muted mt-1">
                    Uploaded
                </div>
            </div>

            {/* Analyzed */}
            <div className="rounded-3xl bg-white border border-border-subtle p-6 shadow-sm">
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Analyzed
                </div>

                <div className="font-display text-4xl font-black mt-2 text-emerald-600">
                    {completedCount}
                </div>

                <div className="text-sm font-medium text-ink-muted mt-1">
                    Completed
                </div>
            </div>

            {/* Applications */}
            <div className="rounded-3xl bg-white border border-border-subtle p-6 shadow-sm">
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Applications
                </div>

                <div className="font-display text-4xl font-black mt-2 text-brand">
                    {totalApplications}
                </div>

                <div className="text-sm font-medium text-ink-muted mt-1">
                    Job applications
                </div>
            </div>

        </div>
    );
}