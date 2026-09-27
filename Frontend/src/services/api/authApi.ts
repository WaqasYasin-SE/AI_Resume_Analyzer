import api from "./axios";

export type User = {
    id: number;
    email: string;
    full_name: string;
};

export type LoginData = {
    email: string;
    password: string;
};

export type RegisterData = {
    full_name: string;
    email: string;
    password: string;
};

export async function getCurrentUser(): Promise<User> {
    const response =
        await api.get<User>("/auth/me");

    return response.data;
}

export async function loginUser(
    data: LoginData
): Promise<void> {
    await api.post(
        "/auth/login",
        data
    );
}

export async function registerUser(
    data: RegisterData
): Promise<User> {
    const response =
        await api.post<User>(
            "/auth/register",
            data
        );

    return response.data;
}

export async function logoutUser(): Promise<void> {
    await api.post("/auth/logout");
}