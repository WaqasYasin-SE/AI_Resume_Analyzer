"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    FileText,
    Briefcase,
    ClipboardList,
    UserCircle,
    Plus,
    Sparkles,
    X,
} from "lucide-react";

type DashboardSidebarProps = {
    open?: boolean;
    onClose?: () => void;
};

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Resumes",
        href: "/resumes",
        icon: FileText,
    },
    {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,
    },
    {
        label: "Applications",
        href: "/applications",
        icon: ClipboardList,
    },
    {
        label: "Profile",
        href: "/profile",
        icon: UserCircle,
    },
];

export default function DashboardSidebar({
    open = false,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    h-screen w-64
                    bg-white
                    border-r border-border-subtle
                    flex flex-col
                    transition-transform duration-300
                    lg:translate-x-0
                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                <div className="flex justify-end px-4 pt-4 lg:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-paper-soft transition"
                        aria-label="Close navigation"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                        Workspace
                    </p>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            const active =
                                pathname === item.href ||
                                pathname.startsWith(
                                    `${item.href}/`
                                );

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-3
                                        rounded-xl
                                        px-3 py-2.5
                                        text-sm font-semibold
                                        transition
                                        ${active
                                            ? "bg-brand/10 text-brand"
                                            : "text-ink-secondary hover:bg-paper-soft hover:text-ink"
                                        }
                                    `}
                                >
                                    <Icon size={18} />

                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8">
                        <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                            Quick Action
                        </p>

                        <Link
                            href="/resumes/upload"
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-xl bg-brand text-white px-3 py-2.5 text-sm font-bold hover:bg-brand-dark transition"
                        >
                            <Plus size={18} />
                            Upload Resume
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-border-subtle">
                    <div className="rounded-2xl bg-paper-soft p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink">
                            <Sparkles
                                size={16}
                                className="text-brand"
                            />

                            AI Career Tools
                        </div>

                        <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                            Analyze your resume and keep your
                            job search organized.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}