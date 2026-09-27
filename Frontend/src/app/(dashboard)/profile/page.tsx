"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Mail,
    ShieldCheck,
    UserCircle,
    Link2,
    Unlink,
} from "lucide-react";

import { useAuth } from "@/app/providers";
import {
    connectGmail,
    getGmailStatus,
    disconnectGmail,
} from "@/services/api/gmailApi";
import LogoutButton from "@/components/LogoutButton";

type GmailConnection = {
    connected: boolean;
    gmail_address: string | null;
};

export default function ProfilePage() {
    const { user } = useAuth();

    const [gmail, setGmail] = useState<GmailConnection>({
        connected: false,
        gmail_address: null,
    });

    const [gmailLoading, setGmailLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [gmailError, setGmailError] = useState<string | null>(
        null
    );

    const displayName = user?.full_name || "User";
    const email = user?.email || "No email available";

    useEffect(() => {
        const loadGmailStatus = async () => {
            try {
                setGmailError(null);

                const response = await getGmailStatus();

                setGmail({
                    connected: response.connected,
                    gmail_address: response.gmail_address,
                });
            } catch (error: any) {
                console.error(
                    "Failed to load Gmail status:",
                    error?.response?.data || error
                );

                setGmail({
                    connected: false,
                    gmail_address: null,
                });

                setGmailError(
                    "Unable to load Gmail connection status."
                );
            } finally {
                setGmailLoading(false);
            }
        };

        loadGmailStatus();
    }, []);

    const handleConnectGmail = async () => {
        try {
            setConnecting(true);
            setGmailError(null);

            const response = await connectGmail();

            window.location.href = response.authorization_url;
        } catch (error: any) {
            console.error(
                "Failed to connect Gmail:",
                error?.response?.data || error
            );

            setConnecting(false);

            setGmailError(
                "Unable to start Gmail connection."
            );
        }
    };

    const handleDisconnectGmail = async () => {
        try {
            setDisconnecting(true);
            setGmailError(null);

            const response = await disconnectGmail();

            console.log(
                "Gmail disconnected successfully:",
                response
            );

            setGmail({
                connected: false,
                gmail_address: null,
            });
        } catch (error: any) {
            console.error(
                "Failed to disconnect Gmail:",
                error?.response?.data || error
            );

            const detail =
                error?.response?.data?.detail;

            setGmailError(
                detail ||
                "Unable to disconnect Gmail. Please try again."
            );
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="font-display text-2xl font-extrabold text-ink">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-ink-muted">
                    Manage your account and connected services.
                </p>
            </div>

            <div className="space-y-6">
                <section className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand text-3xl font-extrabold text-white">
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-extrabold text-ink">
                                {displayName}
                            </h2>

                            <p className="mt-1 text-sm text-ink-muted">
                                {email}
                            </p>

                            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                                <CheckCircle2 size={14} />
                                Active account
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-border-subtle bg-white shadow-sm">
                    <div className="border-b border-border-subtle p-6">
                        <div className="flex items-center gap-3">
                            <UserCircle
                                size={20}
                                className="text-brand"
                            />

                            <div>
                                <h2 className="font-display text-lg font-extrabold text-ink">
                                    Personal Information
                                </h2>

                                <p className="mt-1 text-sm text-ink-muted">
                                    Your account information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                                Full Name
                            </p>

                            <p className="mt-2 text-sm font-semibold text-ink">
                                {displayName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                                Email Address
                            </p>

                            <p className="mt-2 text-sm font-semibold text-ink">
                                {email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                                Account Status
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-green-700">
                                <CheckCircle2 size={16} />
                                Active
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                                Security
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink">
                                <ShieldCheck size={16} />
                                Protected account
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-border-subtle bg-white shadow-sm">
                    <div className="border-b border-border-subtle p-6">
                        <div className="flex items-center gap-3">
                            <Mail
                                size={20}
                                className="text-brand"
                            />

                            <div>
                                <h2 className="font-display text-lg font-extrabold text-ink">
                                    Gmail Integration
                                </h2>

                                <p className="mt-1 text-sm text-ink-muted">
                                    Connect Gmail to monitor job
                                    application responses.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="rounded-2xl bg-paper-soft p-5">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                                        <Mail size={21} />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-extrabold text-ink">
                                                Gmail Account
                                            </h3>

                                            {gmailLoading ? (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-ink-muted">
                                                    Checking...
                                                </span>
                                            ) : gmail.connected ? (
                                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                                                    Connected
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-ink-muted">
                                                    Not connected
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-ink-muted">
                                            {gmail.connected &&
                                                gmail.gmail_address
                                                ? gmail.gmail_address
                                                : "Connect your Gmail account to monitor application emails."}
                                        </p>
                                    </div>
                                </div>

                                {!gmailLoading &&
                                    (gmail.connected ? (
                                        <button
                                            type="button"
                                            onClick={
                                                handleDisconnectGmail
                                            }
                                            disabled={disconnecting}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-paper-soft disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Unlink size={16} />

                                            {disconnecting
                                                ? "Disconnecting..."
                                                : "Disconnect"}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={
                                                handleConnectGmail
                                            }
                                            disabled={connecting}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Link2 size={16} />

                                            {connecting
                                                ? "Connecting..."
                                                : "Connect Gmail"}
                                        </button>
                                    ))}
                            </div>

                            {gmailError && (
                                <p className="mt-4 text-sm font-medium text-red-600">
                                    {gmailError}
                                </p>
                            )}
                        </div>

                        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                            Gmail access is read-only. It can be used to
                            detect responses related to your tracked job
                            applications.
                        </p>
                    </div>
                </section>

                <section className="rounded-2xl border border-border-subtle bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-ink">
                                    Account Actions
                                </h2>

                                <p className="mt-1 text-xs text-ink-muted">
                                    Sign out from your current account.
                                </p>
                            </div>

                            <LogoutButton />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}