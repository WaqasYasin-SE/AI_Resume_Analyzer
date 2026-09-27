"use client";

import { useState } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

import { useAuth } from "@/app/providers";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-paper-soft">

            {/* Sidebar */}
            <DashboardSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="lg:pl-64">

                {/* Navbar */}
                <DashboardNavbar
                    userName={user?.full_name || user?.email}
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                />

                {/* Page content */}
                <main>
                    {children}
                </main>

            </div>
        </div>
    );
}