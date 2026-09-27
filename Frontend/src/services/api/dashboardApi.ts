import api from "./axios";

export type DashboardResponse = {
    resume_score: number | null;
    total_resumes: number;

    total_jobs: number;

    total_applications: number;
    applied: number;
    screening: number;
    interviews: number;
    offers: number;
    rejected: number;
};

export async function getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(
        "/dashboard"
    );

    return response.data;
}