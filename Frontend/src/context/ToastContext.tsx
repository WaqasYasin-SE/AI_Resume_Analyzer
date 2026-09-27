"use client";

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

type ToastType =
    | "success"
    | "error"
    | "warning"
    | "info";

type ToastData = {
    type: ToastType;
    message: string;
};

type ToastContextType = {
    toast: ToastData | null;
    showToast: (
        message: string,
        type?: ToastType
    ) => void;
    hideToast: () => void;
};

const ToastContext =
    createContext<ToastContextType | null>(
        null
    );

export function ToastProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [toast, setToast] =
        useState<ToastData | null>(null);

    const showToast = useCallback(
        (
            message: string,
            type: ToastType = "info"
        ) => {
            setToast({
                message,
                type,
            });
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider
            value={{
                toast,
                showToast,
                hideToast,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextType {
    const context =
        useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}