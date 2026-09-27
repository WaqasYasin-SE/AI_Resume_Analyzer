import api from "./axios";

export type Job = {
    id: number;
    company_name: string;
    job_title: string;
    description: string | null;
    job_url: string | null;
    location: string | null;
    salary: string | null;
    status: string;
    created_at: string;
    updated_at: string;
};

export type JobCreate = {
    company_name: string;
    job_title: string;
    description?: string;
    job_url?: string;
    location?: string;
    salary?: string;
};

export type JobUpdate = {
    company_name?: string;
    job_title?: string;
    description?: string;
    job_url?: string;
    location?: string;
    salary?: string;
    status?: string;
};

export async function getJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>("/jobs/");
    return response.data;
}

export async function getJob(jobId: number): Promise<Job> {
    const response = await api.get<Job>(
        `/jobs/${jobId}`
    );

    return response.data;
}

export async function createJob(
    data: JobCreate
): Promise<Job> {
    const response = await api.post<Job>(
        "/jobs/",
        data
    );

    return response.data;
}

export async function updateJob(
    jobId: number,
    data: JobUpdate
): Promise<Job> {
    const response = await api.put<Job>(
        `/jobs/${jobId}`,
        data
    );

    return response.data;
}

export async function deleteJob(
    jobId: number
): Promise<void> {
    await api.delete(`/jobs/${jobId}`);
}