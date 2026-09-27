"use client";

type DashboardStatsProps = {
    resumeScore: number | null;
    resumeCount: number;
    completedCount: number;
    totalJobs: number;
    totalApplications: number;
    interviews: number;
    offers: number;
};

export default function DashboardStats({
    resumeScore,
    resumeCount,
    completedCount,
    totalJobs,
    totalApplications,
    interviews,
    offers,
}: DashboardStatsProps) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {/* Resume Score */}
            <div className="rounded-3xl bg-white border border-border-subtle p-6 shadow-sm">
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Resume Score
                </div>

                <div className="font-display text-4xl font-black mt-2 text-brand">
                    {resumeScore !== null
                        ? `${resumeScore}%`
                        : "—"}
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
                    {completedCount} analyzed
                </div>
            </div>

            {/* Jobs */}
            <div className="rounded-3xl bg-white border border-border-subtle p-6 shadow-sm">
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Jobs
                </div>

                <div className="font-display text-4xl font-black mt-2 text-brand">
                    {totalJobs}
                </div>

                <div className="text-sm font-medium text-ink-muted mt-1">
                    Saved jobs
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
                    {interviews > 0
                        ? `${interviews} interview${interviews > 1 ? "s" : ""}`
                        : offers > 0
                            ? `${offers} offer${offers > 1 ? "s" : ""}`
                            : "Keep applying"}
                </div>
            </div>

        </div>
    );
}