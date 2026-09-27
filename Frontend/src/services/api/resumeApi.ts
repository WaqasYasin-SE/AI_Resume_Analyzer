import api from "./axios";

export type Resume = {
    id: number;
    original_filename: string;
    stored_filename: string;
    file_path: string;
    file_size: number;
    uploaded_at: string;
    user_id: number;
};

export async function getResumes(): Promise<Resume[]> {
    const response = await api.get<Resume[]>("/resumes");
    return response.data;
}

export async function uploadResume(
    file: File
): Promise<Resume> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<Resume>(
        "/resumes/upload",
        formData
    );

    return response.data;
}

export async function getResume(
    resumeId: number
): Promise<Resume> {
    const response = await api.get<Resume>(
        `/resumes/${resumeId}`
    );

    return response.data;
}

export async function getResumeAnalysis(
    resumeId: number
) {
    const response = await api.get(
        `/resumes/${resumeId}/analysis`
    );

    return response.data;
}

export async function deleteResume(
    resumeId: number
): Promise<void> {
    await api.delete(`/resumes/${resumeId}`);
}

export async function retryResume(
    resumeId: number
) {
    const response = await api.post(
        `/resumes/${resumeId}/retry`
    );

    return response.data;
}