import api from "./axios";

export const connectGmail = async () => {
    const response = await api.get("/gmail/connect");
    return response.data;
};

export const getGmailStatus = async () => {
    const response = await api.get("/gmail/status");
    return response.data;
};
export const disconnectGmail = async () => {
    const response = await api.delete("/gmail/disconnect");
    return response.data;
};