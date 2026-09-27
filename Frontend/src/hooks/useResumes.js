import { useCallback, useEffect, useState } from "react";

import { getResumes } from "../services/api/resumeApi";

export function useResumes() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchResumes = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getResumes();
            setResumes(data);
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Unable to load resumes."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    return {
        resumes,
        loading,
        error,
        refetch: fetchResumes,
    };
}   