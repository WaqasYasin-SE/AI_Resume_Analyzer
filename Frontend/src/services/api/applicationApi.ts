import api from "./axios";

export type ApplicationStatus =
    | "applied"
    | "screening"
    | "interview"
    | "offer"
    | "rejected";

export type Application = {
    id: number;
    user_id: number;
    job_id: number;
    status: ApplicationStatus;
    applied_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type ApplicationCreate = {
    job_id: number;
    status?: ApplicationStatus;
    applied_at?: string;
    notes?: string;
};

export type ApplicationUpdate = {
    status?: ApplicationStatus;
    applied_at?: string;
    notes?: string;
};

export async function getApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>(
        "/applications"
    );

    return response.data;
}

export async function getApplication(
    applicationId: number
): Promise<Application> {
    const response = await api.get<Application>(
        `/applications/${applicationId}`
    );

    return response.data;
}

export async function createApplication(
    data: ApplicationCreate
): Promise<Application> {
    const response = await api.post<Application>(
        "/applications",
        data
    );

    return response.data;
}

export async function updateApplication(
    applicationId: number,
    data: ApplicationUpdate
): Promise<Application> {
    const response = await api.patch<Application>(
        `/applications/${applicationId}`,
        data
    );

    return response.data;
}

export async function deleteApplication(
    applicationId: number
): Promise<void> {
    await api.delete(
        `/applications/${applicationId}`
    );
}