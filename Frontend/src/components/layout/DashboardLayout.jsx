import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "./DashboardLayout.css";

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-layout__content">
                <Navbar />

                <main className="dashboard-layout__main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;